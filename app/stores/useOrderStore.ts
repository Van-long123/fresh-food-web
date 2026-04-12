import { defineStore } from 'pinia'
import { ref } from 'vue'

// ── TypeScript Interfaces ──────────────────────────────────────────────────

export interface OrderProduct {
  id: number
  title: string
  thumbnail: string
  quantity: number
  totalPrice: number
  priceNew?: number
}

export interface CartDetail {
  products: OrderProduct[]
  totalPrice: number
}

export interface Product {
  id: number
  title: string
  thumbnail: string
  priceNew: number
  slug?: string
}

export interface Voucher {
  id: number
  code: string
  title: string
  detail: string
  discountPercent?: number
  discountAmount?: number
  minOrderValue: number
  maxDiscountAmount?: number
  usedCount: number
  totalCount: number
  expiryDate?: string
}

export interface UserInfo {
  fullname: string
  phone: string
  address: string
  ward: string
  district: string
  province: string
  note?: string
}

export interface OrderInfo {
  userInfo: UserInfo
  products: OrderProduct[]
  deliveryMethod: number
  paymentMethod: number
  voucherCode?: string
  discountVoucher: number
  shippingFee: number
  totalPrice: number
}

export interface OrderPayload {
  userInfo: UserInfo
  products: OrderProduct[]
  deliveryMethod: number
  paymentMethod: number
  voucherCode?: string
  discountVoucher: number
  shippingFee: number
  totalPrice: number
}

// ── Store ──────────────────────────────────────────────────────────────────

export const useOrderStore = defineStore('order', () => {
  const cartDetail = ref<CartDetail | null>(null)
  const product = ref<Product | null>(null)
  const orderInfo = ref<OrderInfo | null>(null)

  function setCartDetail(detail: CartDetail) {
    cartDetail.value = detail
  }

  function setProduct(p: Product) {
    product.value = p
  }

  function setOrderInfo(info: OrderInfo) {
    orderInfo.value = info
  }

  function clearOrder() {
    cartDetail.value = null
    product.value = null
    orderInfo.value = null
  }

  return {
    cartDetail,
    product,
    orderInfo,
    setCartDetail,
    setProduct,
    setOrderInfo,
    clearOrder,
  }
})
