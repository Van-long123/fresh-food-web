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
