export interface Address {
  _id: string
  userId: string
  username: string
  address: string
  phone: string
  province: string
  district: string
  ward: string
  province_id: number
  district_id: number
  ward_code: string
  default: 0 | 1
  createdAt: number
  updatedAt: number | null
}

export interface AddressPayload {
  username: string
  address: string
  phone: string
  province: string
  district: string
  ward: string
  province_id: number
  district_id: number
  ward_code: string
  default: 0 | 1
}
