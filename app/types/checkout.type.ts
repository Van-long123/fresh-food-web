export interface ShippingFeeAddressInfo {
  _id: string
  username: string
  phone: string
  address: string
  ward: string
  district: string
  province: string
  district_id: number
  ward_code: string
}

/** Sản phẩm giỏ hàng gửi lên cho GHN */
export interface ShippingFeeProduct {
  _id: string
  name: string
  quantity: number
}

export interface ShippingFeePayload {
  addressId: string
  products?: ShippingFeeProduct[]
}

export interface ShippingFeeResponse {
  shippingFee: number
  isFallback: boolean
  address: ShippingFeeAddressInfo
}

export interface SelectedCartItem {
  id: string
  name: string
  image: string
  price: number
  originalPrice?: number | null
  quantity: number
  slug: string
  stock: number
  categoryId?: string | null
}

export interface CheckoutPayload {
  products: SelectedCartItem[]
  voucherCode?: string
  discountVoucher: number
  subtotal: number
  grandTotal: number
}

export interface StockValidationItem {
  productId: string
  quantity: number
}

export interface ValidationResponse {
  valid: Array<{ productId: string; quantity: number; currentStock: number; name: string }>
  clamped: Array<{ productId: string; name: string; requestedQty: number; currentStock: number }>
  outOfStock: Array<{ productId: string; name: string; currentStock: number }>
}

export interface CodCheckoutProduct {
  productId: string
  quantity: number
}

export interface CodCheckoutPayload {
  addressId: string
  products: CodCheckoutProduct[]
  voucherCode?: string
  note?: string
  shippingFee?: number
}

// Alias - PayOS dùng cùng payload structure với COD
export type PayOSCheckoutPayload = CodCheckoutPayload

export interface PayOSCheckoutResponse {
  checkoutUrl: string
  orderId: string
}
