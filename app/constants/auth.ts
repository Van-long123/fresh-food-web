export interface RegisterPayload {
  email: string
  password: string
  phone: string
  displayName: string
}

export interface VerifyAccountPayload {
  email: string
  token: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface ForgotPasswordPayload {
  email: string
}

export interface ResetPasswordPayload {
  email: string
  token: string
  newPassword: string
}

export interface UpdateProfilePayload {
  displayName?: string
  phone?: string
  avatar?: string
  address?: string
  ward?: string
  ward_code?: number | null
  district?: string
  district_code?: number | null
  province?: string
  province_code?: number | null
  gender?: string
  current_password?: string
  new_password?: string
}

export type ForgotPasswordPageState = 'input' | 'success' | 'error'
