export interface OrderProduct {
  id: string | number
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
  id: string | number
  title: string
  thumbnail: string
  priceNew: number
  slug?: string
}

export interface Voucher {
  id: string | number
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

export interface CheckoutData {
  products: OrderProduct[]
  voucherCode?: string
  discountVoucher: number
  shippingFee: number
  subtotal: number
  grandTotal: number
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
