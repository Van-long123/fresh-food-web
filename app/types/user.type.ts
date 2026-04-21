export interface AuthUser {
  _id: string
  email: string
  username: string
  displayName: string
  phone: string
  avatar?: string | null
  role?: 'client' | 'admin'
  address?: string
  ward?: string
  ward_code?: number | null
  district?: string
  district_code?: number | null
  province?: string
  province_code?: number | null
  gender?: string
  isActive?: boolean
}
