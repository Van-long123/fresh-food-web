import { defineStore } from 'pinia'
import { ref } from 'vue'

// TypeScript Interfaces

import type {
  OrderProduct,
  CartDetail,
  Product,
  Voucher,
  UserInfo,
  OrderInfo,
  CheckoutData,
  OrderPayload
} from '~/types/order.type'

export type {
  OrderProduct,
  CartDetail,
  Product,
  Voucher,
  UserInfo,
  OrderInfo,
  CheckoutData,
  OrderPayload
}


export const useOrderStore = defineStore('order', () => {
  // const cartDetail = ref<CartDetail | null>(null)
  const product = ref<Product | null>(null)
  const orderInfo = ref<OrderInfo | null>(null)
  
  // Dữ liệu tạm thời mang từ trang Cart sang Checkout
  const checkoutData = ref<CheckoutData | null>(null)

  // function setCartDetail(detail: CartDetail) {
  // cartDetail.value = detail
  // }

  function setProduct(p: Product) {
    product.value = p
  }

  function setOrderInfo(info: OrderInfo) {
    orderInfo.value = info
  }
  
  function setCheckoutData(data: CheckoutData) {
    checkoutData.value = data
  }

  function clearOrder() {
    // cartDetail.value = null
    product.value = null
    orderInfo.value = null
    checkoutData.value = null
  }

  return {
    // cartDetail,
    product,
    orderInfo,
    checkoutData,
    // setCartDetail,
    setProduct,
    setOrderInfo,
    setCheckoutData,
    clearOrder,
  }
})
