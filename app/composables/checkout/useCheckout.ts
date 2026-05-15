import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useAuthStore } from '~/stores/useAuthStore'
import { useCartStore } from '~/stores/useCartStore'
import { useOrderStore } from '~/stores/useOrderStore'
import { getAuthorizedAxios } from '~/utils/authorizedAxios'
import { API_ENDPOINTS } from '~/constants/api'
import { ROUTES } from '~/constants/routes'
import type { 
  SelectedCartItem, 
  CheckoutPayload, 
  StockValidationItem, 
  ValidationResponse 
} from '~/types/checkout.type'

const isValidating = ref(false)
const itemsNeedingAdjustment = ref(new Set<string>())
const itemsOutOfStock = ref(new Set<string>())

export const useCheckout = () => {
  const router = useRouter()
  const toast = useToast()
  const authStore = useAuthStore()
  const cartStore = useCartStore()
  const orderStore = useOrderStore()

  /**
   * Kiểm tra xác thực người dùng
   * Nếu chưa login: hiển thị Toast + redirect với query params
   */
  const validateAuthentication = () => {
    if (!authStore.isLoggedIn) {
      toast.add({
        severity: 'warn',
        summary: 'Chưa đăng nhập',
        detail: 'Vui lòng đăng nhập để tiếp tục đặt hàng',
        life: 3000
      })
      router.push({
        path: ROUTES.AUTH.LOGIN,
        query: { redirect: ROUTES.CART }
      })
      return false
    }
    return true
  }

  /**
   * Gọi API kiểm tra tồn kho từ backend
   */
  const validateStockOnBackend = async (items: StockValidationItem[]): Promise<ValidationResponse> => {
    try {
      const response = await getAuthorizedAxios().post(API_ENDPOINTS.ORDER.VALIDATE_STOCK, { items })
      return response.data.data
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || 'Lỗi kiểm tra tồn kho'
      throw new Error(errorMessage)
    }
  }

  /**
   * Xử lý kết quả kiểm tra tồn kho
   * Trường hợp 1: Tất cả valid → tiếp tục checkout
   * Trường hợp 2: Có items clamped → tự động cập nhật số lượng, hiển thị thông báo
   * Trường hợp 3: Có items out of stock → bỏ tích, hiển thị thông báo
   */
  const handleValidationResult = async (
    validation: ValidationResponse,
    selectedItems: SelectedCartItem[],
    onOutOfStock?: (ids: Set<string>) => void
  ): Promise<boolean> => {
    itemsNeedingAdjustment.value.clear()
    itemsOutOfStock.value.clear()

    // Trường hợp 3: Hết hàng - bỏ tích và cập nhật
    if (validation.outOfStock.length > 0) {
      const outOfStockIds = new Set(validation.outOfStock.map((item) => item.productId))
      itemsOutOfStock.value = outOfStockIds

      // Callback để cart.vue xử lý uncheck
      if (onOutOfStock) {
        onOutOfStock(outOfStockIds)
      }

      const names = validation.outOfStock.map((a) => `"${a.name}"`).join(', ')
      toast.add({
        severity: 'error',
        summary: 'Sản phẩm hết hàng',
        detail: `${names} đã hết hàng.`,
        life: 4000
      })
      return false
    }

    // Trường hợp 2: Thiếu hàng - tự động giảm số lượng
    if (validation.clamped.length > 0) {
      itemsNeedingAdjustment.value = new Set(
        validation.clamped.map((item) => item.productId)
      )

      // Cập nhật số lượng trong giỏ hàng
      const updatedCart = selectedItems.map((item) => {
        const clamped = validation.clamped.find((c) => c.productId === item.id)
        if (clamped) {
          return {
            ...item,
            quantity: clamped.currentStock // Cập nhật lại số lượng = stock còn lại
          }
        }
        return item
      })

      // Cập nhật orderStore với số lượng đã điều chỉnh
      const existingCheckoutData = orderStore.checkoutData
      if (existingCheckoutData) {
        orderStore.setCheckoutData({
          ...existingCheckoutData,
          products: updatedCart.map((item) => ({
            id: item.id,
            title: item.name,
            thumbnail: item.image || '',
            quantity: item.quantity,
            priceNew: item.price,
            totalPrice: item.price * item.quantity
          }))
        })
      }

      const names = validation.clamped
        .map((a) => `"${a.name}" (chỉ còn ${a.currentStock})`)
        .join(', ')
      toast.add({
        severity: 'warn',
        summary: 'Cập nhật số lượng',
        detail: `${names}. Vui lòng xác nhận lại trước khi đặt hàng.`,
        life: 4000
      })
      return false
    }

    // Trường hợp 1: Tất cả thành công
    toast.add({
      severity: 'success',
      summary: 'Kiểm tra tồn kho thành công',
      detail: 'Tất cả sản phẩm đủ hàng. Vui lòng tiếp tục thanh toán.',
      life: 2000
    })
    return true
  }

  /**
   * Main function: Thực hiện quy trình checkout
   * 1. Kiểm tra xác thực
   * 2. Gọi API validate stock
   * 3. Xử lý kết quả
   * 4. Nếu thành công → redirect checkout, nếu không → giữ lại trang cart
   */
  const proceedToCheckout = async (
    selectedItems: SelectedCartItem[],
    checkoutPayload: CheckoutPayload,
    onOutOfStock?: (ids: Set<string>) => void
  ) => {
    if (!validateAuthentication()) {
      return
    }

    if (selectedItems.length === 0) {
      toast.add({
        severity: 'warn',
        summary: 'Chưa chọn sản phẩm',
        detail: 'Vui lòng chọn ít nhất một sản phẩm để đặt hàng',
        life: 3000
      })
      return
    }

    isValidating.value = true

    try {
      // Chuẩn bị data kiểm tra tồn kho
      const itemsForValidation: StockValidationItem[] = selectedItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity
      }))

      // Gọi API backend để kiểm tra tồn kho
      const validation = await validateStockOnBackend(itemsForValidation)

      // Xử lý kết quả
      const isValid = await handleValidationResult(validation, selectedItems, onOutOfStock)

      if (isValid) {
        // Lưu checkout data vào orderStore
        orderStore.setCheckoutData(checkoutPayload)
        // Redirect sang trang checkout
        await router.push(ROUTES.ORDER.CHECKOUT)
      }
    } catch (error: any) {
      const errorMsg = error?.message || 'Lỗi không xác định khi kiểm tra tồn kho'
      toast.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: errorMsg,
        life: 3000
      })
    } finally {
      isValidating.value = false
    }
  }

  return {
    isValidating,
    itemsNeedingAdjustment,
    itemsOutOfStock,
    proceedToCheckout,
    validateAuthentication,
    validateStockOnBackend,
    handleValidationResult
  }
}
