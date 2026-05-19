import { ref, computed, watch } from 'vue'
import type { Ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useAuthStore } from '~/stores/useAuthStore'
import { useOrderStore } from '~/stores/useOrderStore'
import { ROUTES } from '~/constants/routes'
import { useShippingFee } from '~/composables/checkout/useShippingFee'
import { useValidateStockMutation, useCreateCodOrderMutation, useCreatePayOSOrderMutation } from '~/mutations/checkout/useCheckoutMutations'
import { useValidateVoucherMutation } from '~/mutations/voucher/useValidateVoucherMutation'
import type { 
  SelectedCartItem, 
  CheckoutPayload, 
  StockValidationItem, 
  ValidationResponse,
  CodCheckoutPayload,
  PayOSCheckoutPayload
} from '~/types/checkout.type'
import type { OrderInfo } from '~/types/order.type'

const isValidating = ref(false)
const itemsNeedingAdjustment = ref(new Set<string>())
const itemsOutOfStock = ref(new Set<string>())
const isSubmitting = ref(false)
const isApplyingVoucher = ref(false)
const voucherCode = ref('')
const discountVoucher = ref(0)
const voucherError = ref('')
const paymentMethod = ref(0)

const paymentOptions = [
  { label: 'Thanh toán khi nhận hàng (COD)', value: 0 },
  { label: 'VietQR qua PayOS', value: 1 }
]

const paymentSteps = [
  'Xác nhận thông tin giao hàng',
  'Kiểm tra tồn kho thời gian thực',
  'Áp dụng voucher (nếu có)',
  'Xác nhận đơn và thanh toán'
]

export const useCheckout = (options: { selectedAddressId?: Ref<string | null> } = {}) => {
  const router = useRouter()
  const toast = useToast()
  const authStore = useAuthStore()
  const orderStore = useOrderStore()
  const { selectedAddressId } = options

  const validateStockMutation = useValidateStockMutation()
  const validateVoucherMutation = useValidateVoucherMutation()
  const createCodOrderMutation = useCreateCodOrderMutation()
  const createPayOSOrderMutation = useCreatePayOSOrderMutation()

  const cartProducts = computed(() => orderStore.checkoutData?.products || [])
  const subtotal = computed(() =>
    cartProducts.value.reduce((sum, item) => sum + Number(item.totalPrice || 0), 0)
  )

  watch(
    () => orderStore.checkoutData,
    (data) => {
      if (!data) return
      voucherCode.value = data.voucherCode || ''
      discountVoucher.value = Number(data.discountVoucher || 0)
    },
    { immediate: true }
  )

  const shippingState = selectedAddressId
    ? useShippingFee(selectedAddressId, cartProducts as Ref<any>)
    : null

  const shippingFee = computed(() => shippingState?.shippingFee.value ?? 0)
  const isFetchingShippingFee = computed(() => shippingState?.isFetchingShippingFee.value ?? false)
  const fetchShippingFee = (addressId: string) => shippingState?.fetchShippingFee(addressId)

  const grandTotal = computed(() =>
    Math.max(0, subtotal.value - discountVoucher.value + shippingFee.value)
  )

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
      return await validateStockMutation.mutateAsync(items)
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
            totalPrice: item.price * item.quantity,
            categoryId: item.categoryId || null
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

  const clearVoucher = () => {
    voucherCode.value = ''
    discountVoucher.value = 0
    voucherError.value = ''

    const existingCheckout = orderStore.checkoutData
    if (existingCheckout) {
      orderStore.setCheckoutData({
        ...existingCheckout,
        voucherCode: undefined,
        discountVoucher: 0,
        subtotal: subtotal.value,
        grandTotal: subtotal.value + shippingFee.value
      })
    }
  }

  const applyVoucher = async (): Promise<boolean> => {
    const code = voucherCode.value.trim().toUpperCase()
    if (!code) {
      voucherError.value = 'Vui lòng nhập mã giảm giá'
      return false
    }

    isApplyingVoucher.value = true
    voucherError.value = ''

    try {
      const items = cartProducts.value.map((item) => ({
        productId: String(item.id),
        categoryId: item.categoryId || undefined,
        quantity: item.quantity,
        price: item.priceNew ?? (item.quantity ? item.totalPrice / item.quantity : 0)
      }))

      const response = await validateVoucherMutation.mutateAsync({
        code,
        orderValue: subtotal.value,
        shippingFee: shippingFee.value,
        items
      })

      const discountAmount = Number(response?.discountAmount || 0)
      const validCode = response?.voucher?.code || code
      const voucherType = response?.voucher?.type || null

      // Update local refs
      discountVoucher.value = discountAmount
      voucherCode.value = validCode

      // Update store
      const existingCheckout = orderStore.checkoutData
      if (existingCheckout) {
        orderStore.setCheckoutData({
          ...existingCheckout,
          voucherCode: validCode,
          voucherType,
          discountVoucher: discountAmount,
          subtotal: subtotal.value,
          grandTotal: Math.max(0, subtotal.value - discountAmount + shippingFee.value)
        })
      }

      toast.add({
        severity: 'success',
        summary: 'Voucher đã áp dụng',
        detail: `Đã áp dụng mã ${validCode} thành công.`,
        life: 2500
      })
      return true
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Mã giảm giá không hợp lệ'
      voucherError.value = message
      
      toast.add({
        severity: 'error',
        summary: 'Voucher không hợp lệ',
        detail: message,
        life: 3500
      })
      return false
    } finally {
      isApplyingVoucher.value = false
    }
  }

  /**
   * [Premium UX] Tự động đồng bộ lại số tiền giảm khi phí vận chuyển thay đổi.
   * Kới được: người dùng đổi địa chỉ nhận hàng và đang có voucher freeship hoạt động.
   */
  watch(
    () => shippingFee.value,
    async (newFee, oldFee) => {
      if (newFee === oldFee) return
      // Chỉ re-apply khi đang có voucher được áp dụng
      if (!voucherCode.value) return
      // Tránh re-apply khi đang trong quá trình áp dụng
      if (isApplyingVoucher.value) return

      // Silent re-apply: không hiển thị toast thành công để không spam UX
      isApplyingVoucher.value = true
      try {
        const items = cartProducts.value.map((item) => ({
          productId: String(item.id),
          categoryId: item.categoryId || undefined,
          quantity: item.quantity,
          price: item.priceNew ?? (item.quantity ? item.totalPrice / item.quantity : 0)
        }))

        const response = await validateVoucherMutation.mutateAsync({
          code: voucherCode.value,
          orderValue: subtotal.value,
          shippingFee: newFee,
          items
        })

        const discountAmount = Number(response?.discountAmount || 0)
        discountVoucher.value = discountAmount

        // Đồng bộ lại store
        const existingCheckout = orderStore.checkoutData
        if (existingCheckout) {
          orderStore.setCheckoutData({
            ...existingCheckout,
            discountVoucher: discountAmount,
            grandTotal: Math.max(0, subtotal.value - discountAmount + newFee)
          })
        }
      } catch {
        // Nếu re-apply thất bại (ví dụ: voucher hết hạn), xóa voucher để tránh tính sai
        voucherCode.value = ''
        discountVoucher.value = 0
        const existingCheckout = orderStore.checkoutData
        if (existingCheckout) {
          orderStore.setCheckoutData({
            ...existingCheckout,
            voucherCode: undefined,
            discountVoucher: 0,
            grandTotal: Math.max(0, subtotal.value + newFee)
          })
        }
      } finally {
        isApplyingVoucher.value = false
      }
    }
  )

  const submitCODOrder = async (payload: {
    addressId: string
    note?: string
    selectedAddress?: { username: string; phone: string; address: string; ward: string; district: string; province: string }
  }) => {
    if (!validateAuthentication()) return

    if (!payload.addressId || !payload.selectedAddress) {
      toast.add({
        severity: 'warn',
        summary: 'Cảnh báo',
        detail: 'Vui lòng chọn địa chỉ giao hàng',
        life: 3000
      })
      return
    }

    const orderProducts = cartProducts.value.map((item) => ({
      productId: String(item.id),
      quantity: item.quantity
    }))

    if (!orderProducts.length) {
      toast.add({
        severity: 'warn',
        summary: 'Giỏ hàng trống',
        detail: 'Vui lòng chọn sản phẩm để thanh toán',
        life: 3000
      })
      return
    }

    isSubmitting.value = true

    try {
      const checkoutPayload: CodCheckoutPayload = {
        addressId: payload.addressId,
        products: orderProducts,
        voucherCode: voucherCode.value || undefined,
        note: payload.note || '',
        shippingFee: shippingFee.value
      }

      await createCodOrderMutation.mutateAsync(checkoutPayload)

      const orderInfo: OrderInfo = {
        userInfo: {
          fullname: payload.selectedAddress.username,
          phone: payload.selectedAddress.phone,
          address: payload.selectedAddress.address,
          ward: payload.selectedAddress.ward,
          district: payload.selectedAddress.district,
          province: payload.selectedAddress.province,
          note: payload.note || ''
        },
        products: cartProducts.value.map((item) => ({
          id: item.id,
          title: item.title,
          thumbnail: item.thumbnail,
          quantity: item.quantity,
          totalPrice: item.totalPrice,
          priceNew: item.priceNew,
          categoryId: item.categoryId || null
        })),
        deliveryMethod: 1,
        paymentMethod: paymentMethod.value,
        voucherCode: voucherCode.value || undefined,
        discountVoucher: discountVoucher.value,
        shippingFee: shippingFee.value,
        totalPrice: grandTotal.value
      }

      orderStore.setOrderInfo(orderInfo)
      return orderInfo
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        'Thanh toán thất bại, vui lòng thử lại.'
      toast.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: message,
        life: 4000
      })
    } finally {
      isSubmitting.value = false
    }
  }

  const submitPayOSOrder = async (payload: {
    addressId: string
    note?: string
  }) => {
    if (!validateAuthentication()) return

    if (!payload.addressId) {
      toast.add({
        severity: 'warn',
        summary: 'Cảnh báo',
        detail: 'Vui lòng chọn địa chỉ giao hàng',
        life: 3000
      })
      return
    }

    const orderProducts = cartProducts.value.map((item) => ({
      productId: String(item.id),
      quantity: item.quantity
    }))

    if (!orderProducts.length) {
      toast.add({
        severity: 'warn',
        summary: 'Giỏ hàng trống',
        detail: 'Vui lòng chọn sản phẩm để thanh toán',
        life: 3000
      })
      return
    }

    isSubmitting.value = true

    try {
      const checkoutPayload: PayOSCheckoutPayload = {
        addressId: payload.addressId,
        products: orderProducts,
        voucherCode: voucherCode.value || undefined,
        note: payload.note || '',
        shippingFee: shippingFee.value
      }

      const result = await createPayOSOrderMutation.mutateAsync(checkoutPayload)

      if (result?.checkoutUrl) {
        // Redirect sang trang cổng thanh toán PayOS (VietQR)
        window.location.href = result.checkoutUrl
      }

      return result
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        'Tạo liên kết thanh toán thất bại, vui lòng thử lại.'
      toast.add({
        severity: 'error',
        summary: 'Lỗi PayOS',
        detail: message,
        life: 4000
      })
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    isValidating,
    itemsNeedingAdjustment,
    itemsOutOfStock,
    proceedToCheckout,
    validateAuthentication,
    validateStockOnBackend,
    handleValidationResult,
    cartProducts,
    subtotal,
    shippingFee,
    isFetchingShippingFee,
    fetchShippingFee,
    grandTotal,
    voucherCode,
    discountVoucher,
    voucherError,
    isApplyingVoucher,
    applyVoucher,
    clearVoucher,
    isSubmitting,
    submitCODOrder,
    submitPayOSOrder,
    paymentMethod,
    paymentOptions,
    paymentSteps
  }
}
