import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import ToastEventBus from 'primevue/toasteventbus'
import { storeToRefs } from 'pinia'
import { useCartStore } from '~/stores/useCartStore'
import { useAuthStore } from '~/stores/useAuthStore'
import { cartService } from '~/services/cart.service'
import type { CartRequestItem, CartResponse } from '~/types/cart.type'

type ProductInput = {
  id: string | number
  name: string
  price: number
  image?: string
  stock?: number
  slug?: string
  quantity?: number
  categoryId?: string | null
}

const CART_TTL = 1000 * 60 * 60 * 24 * 7

const notice = ref('')
const noticeTitle = ref('')
const noticeKey = ref(0)
// const stockNotice = ref('')
const adjustedIds = ref(new Set<string>())
const isLoading = ref(false)
const isReady = ref(false)
const updatingIds = ref(new Set<string>())

// Helpers cho UI State
const clearToastQueue = () => {
  ToastEventBus.emit('remove-all-groups')
}

const setStockNotice = (ids: Set<string>) => {
// const setStockNotice = (message: string, ids: Set<string>) => {
  // stockNotice.value = message
  adjustedIds.value = ids
}

const setUpdating = (productId: string, value: boolean) => {
  if (value) updatingIds.value.add(productId)
  else updatingIds.value.delete(productId)
}

const isItemUpdating = (productId: string) => updatingIds.value.has(productId)

export const useCart = () => {
  const toast = useToast()
  const store = useCartStore()
  const authStore = useAuthStore()

  const triggerNotice = (message: string, title = 'Thành công') => {
    const severity =
      title === 'Thành công'
        ? 'success'
        : message.includes('hết hàng') || message.includes('giới hạn')
          ? 'warn'
          : 'info'

    clearToastQueue()
    toast.add({
      severity,
      summary: title,
      detail: message,
      life: 3000,
    })
  }

  const showErrorToast = (error: any) => {
    toast.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: error?.response?.data?.message || 'Có lỗi xảy ra với giỏ hàng.',
      life: 3000
    })
  }

  // Chỉ lấy các state cốt lõi từ Pinia
  const {
    cartItems,
    itemCount,
    totalCartItems,
    totalAmount
  } = storeToRefs(store)

  const formatVnd = (value: number) => `${value.toLocaleString('vi-VN')}đ`

  const hasAdjustments = (payload: CartResponse) => {
    const clamped = payload.adjustments?.clamped?.length || 0
    const removed = payload.adjustments?.removed?.length || 0
    return clamped + removed > 0
  }

  // sync cart từ server + xử lý stock adjustment
  const applyCartResponse = (payload: CartResponse) => {
    // Merge duplicates if server returns them for any reason
    const mergedItemsMap = new Map<string, any>();
    
    payload.items.forEach((item) => {
      const existing = mergedItemsMap.get(item.productId);
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        mergedItemsMap.set(item.productId, {
          id: item.productId,
          productId: item.productId,
          categoryId: item.categoryId || null,
          name: item.name,
          image: item.image,
          price: item.price,
          originalPrice: item.originalPrice,
          stock: item.stock,
          quantity: item.quantity,
          slug: item.slug,
          unit: item.unit
        });
      }
    });

    store.setCartItems(Array.from(mergedItemsMap.values()));

    if (hasAdjustments(payload)) {
      const adjusted = new Set<string>()
      const messages: string[] = []

      if (payload.adjustments?.removed?.length) {
        const names = payload.adjustments.removed.map((a) => `"${a.name || 'Sản phẩm'}"`).join(', ')
        messages.push(`Đã xóa ${names} do hết hàng hoặc ngừng kinh doanh.`)
        payload.adjustments.removed.forEach((item) => adjusted.add(item.productId))
      }

      if (payload.adjustments?.clamped?.length) {
        const names = payload.adjustments.clamped.map((a) => `"${a.name || 'Sản phẩm'}"`).join(', ')
        messages.push(`Đã giảm số lượng ${names} theo tồn kho thực tế.`)
        payload.adjustments.clamped.forEach((item) => adjusted.add(item.productId))
      }

      // Ưu tiên sử dụng message cụ thể từ Server gửi về (ví dụ: "Đã đạt giới hạn tồn kho...")
      const noticeMsg = (payload as any).message || messages.join(' ')
      setStockNotice(adjusted)
      triggerNotice(noticeMsg, 'Thông báo giỏ hàng')
    } else {
      setStockNotice(new Set())
      // setStockNotice('', new Set())
    }
  }

  const ensureCartReady = async () => {
    // Nó nhảy từ false -> true và giữ nguyên true mãi mãi cho đến khi bạn F5 trình duyệt.
    isReady.value = true
    isLoading.value = true

    try {
      if (authStore.isLoggedIn) {
        const response = await cartService.getCart()
        applyCartResponse(response)
      } else {
        if (store.savedAt > 0 && Date.now() - store.savedAt > CART_TTL) {
          store.clearGuestCart()
        } else if (cartItems.value.length) {
          const response = await cartService.validateCart(
            cartItems.value.map((item) => ({ productId: item.productId, quantity: item.quantity }))
          )
          applyCartResponse(response)
        }
      }
    } finally {
      isLoading.value = false
    }
  }

  const syncAfterLogin = async () => {
    if (!authStore.isLoggedIn) return

    try {
      if (!cartItems.value.length) {
        const response = await cartService.getCart()
        applyCartResponse(response)
        return
      }

      const payload: CartRequestItem[] = cartItems.value.map((item) => ({
        productId: item.productId,
        quantity: item.quantity
      }))

      const response = await cartService.mergeCart(payload)
      store.clearGuestCart() 
      if (typeof window !== 'undefined') localStorage.removeItem('smartfood-cart')
      applyCartResponse(response)
    } catch (error) {
      showErrorToast(error)
    }
  }

  const addToCart = async (product: ProductInput) => {
    const productId = String(product.id)
    const quantity = Math.max(1, Number(product.quantity || 1))
    const stock = typeof product.stock === 'number' ? product.stock : Number.POSITIVE_INFINITY

    // Kiểm tra stock ở frontend trước khi gửi request
    if (stock <= 0) {
      triggerNotice(`${product.name} đã hết hàng`, 'Thông báo')
      return
    }

    if (authStore.isLoggedIn) {
      setUpdating(productId, true)
      try {
        const response = await cartService.addItem({ productId, quantity })
        applyCartResponse(response)
        
        // Nếu Server không trả về message đặc biệt (như giới hạn tồn kho), thì mới báo thành công
        if (!(response as any).message) {
          triggerNotice(`Đã thêm "${product.name}" vào giỏ hàng`, 'Thành công')
        }
      } catch (error: any) {
        const serverMsg = error?.response?.data?.message || ''
        
        // Xử lý các error message từ backend
        if (serverMsg.includes('hết hàng')) {
          triggerNotice(serverMsg, 'Thông báo')
        } else if (serverMsg.includes('giới hạn') || serverMsg.includes('vượt quá')) {
          triggerNotice(serverMsg, 'Thông báo') // Sẽ tự động thành 'warn' do triggerNotice check nội dung
        } else if (serverMsg.includes('không còn tồn tại') || serverMsg.includes('ngừng kinh doanh')) {
          triggerNotice(serverMsg, 'Thông báo')
        } else {
          showErrorToast(error)
        }
      } finally {
        setUpdating(productId, false)
      }
      return
    }

    // GUEST USER LOGIC: Đạt chuẩn Production (Check stock thực tế từ API trước khi add)
    setUpdating(productId, true)
    try {
      // 1. Check stock của sản phẩm này trước
      const checkRes = await cartService.validateCart([{ productId, quantity }])
      const validatedItem = checkRes.items.find(i => i.productId === productId)

      // Nếu stock thực tế từ DB trả về = 0
      if (!validatedItem || validatedItem.stock <= 0) {
        triggerNotice(`Sản phẩm "${product.name}" đã hết hàng`, 'Thông báo')
        return
      }

      // 2. Nếu OK, tiến hành merge vào giỏ hàng local
      const localItems = cartItems.value.map((item) => ({ ...item }))
      const existing = localItems.find((item) => item.productId === productId)
      
      if (existing) {
        existing.quantity += quantity
      } else {
        localItems.unshift({
          id: productId,
          productId,
          categoryId: product.categoryId || null,
          name: product.name,
          image: product.image || '',
          price: product.price,
          originalPrice: null,
          stock: validatedItem.stock,
          quantity: quantity,
          slug: product.slug
        })
      }

      // 3. Validate toàn bộ giỏ hàng mới để chuẩn hóa các sản phẩm khác (nếu có)
      const response = await cartService.validateCart(
        localItems.map((item) => ({ productId: item.productId, quantity: item.quantity }))
      )

      applyCartResponse(response)

      // Hiển thị thông báo
      if (!(response as any).message) {
        triggerNotice(`Đã thêm "${product.name}" vào giỏ hàng`, 'Thành công')
      }
    } catch (error) {
      showErrorToast(error)
    } finally {
      setUpdating(productId, false)
    }
  }

  const updateItemQuantity = async (productId: string, quantity: number) => {
    if (isItemUpdating(productId)) return

    setUpdating(productId, true)
    try {
      if (authStore.isLoggedIn) {
        try {
          const response = await cartService.updateItem(productId, quantity)
          applyCartResponse(response)
        } catch (error) {
          showErrorToast(error)
        }
        return
      }

      const localItems = cartItems.value.map((item) => ({ ...item }))
      const target = localItems.find((item) => item.productId === productId)
      if (!target) return

      if (quantity <= 0) {
        store.setCartItems(localItems.filter((item) => item.productId !== productId))
        return
      }

      const nextQty = Math.min(quantity, target.stock || quantity)
      target.quantity = nextQty
      store.setCartItems(localItems)
      
      try {
        const response = await cartService.validateCart(
          localItems.map((item) => ({ productId: item.productId, quantity: item.quantity }))
        )
        applyCartResponse(response)
      } catch (error) {
        showErrorToast(error)
      }
    } finally {
      setUpdating(productId, false)
    }
  }

  const increaseQty = async (id: string) => {
    const item = cartItems.value.find((it) => it.productId === id)
    if (!item) return
    
    // Luôn gọi API để check stock thời gian thực thay vì tự check ở FE
    await updateItemQuantity(id, item.quantity + 1)
  }

  const decreaseQty = async (id: string) => {
    const item = cartItems.value.find((it) => it.productId === id)
    if (!item) return
    if (item.quantity <= 1) {
      await removeItem(id)
    } else {
      await updateItemQuantity(id, item.quantity - 1)
    }
  }

  const removeItem = async (id: string) => {
    if (authStore.isLoggedIn) {
      try {
        const response = await cartService.removeItem(id)
        applyCartResponse(response)
        triggerNotice('Đã xóa sản phẩm khỏi giỏ hàng', 'Giỏ hàng')
      } catch (error) {
        showErrorToast(error)
      }
      return
    }

    store.setCartItems(cartItems.value.filter((item) => item.productId !== id))
    triggerNotice('Đã xóa sản phẩm khỏi giỏ hàng', 'Giỏ hàng')
  }

  const removeItems = async (ids: string[]) => {
    if (!ids.length) return

    if (authStore.isLoggedIn) {
      try {
        const response = await cartService.removeItems(ids)
        applyCartResponse(response)
      } catch (error) {
        showErrorToast(error)
      }
      return
    }

    const removeSet = new Set(ids)
    store.setCartItems(cartItems.value.filter((item) => !removeSet.has(item.productId)))
  }

  return {
    // Pinia Data State
    cartItems,
    itemCount,
    totalCartItems,
    totalAmount,
    
    // Shared UI State
    notice,
    noticeTitle,
    noticeKey,
    // stockNotice,
    adjustedIds,
    isLoading,
    isReady,
    
    // Actions & Helpers
    formatVnd,
    triggerNotice,
    ensureCartReady,
    syncAfterLogin,
    addToCart,
    updateItemQuantity,
    increaseQty,
    decreaseQty,
    removeItem,
    removeItems,
    isItemUpdating
  }
}

