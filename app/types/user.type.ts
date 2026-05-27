export interface AuthUser {
  id: string
  fullname: string
  phone: string
  role: string
  email?: string
  address?: string
  avatar?: string
  birthday?: string
  gender?: string
  verified?: boolean
}

export interface ApiAuthUser {
  _id: string
  displayName: string
  phone: string
  role: string
  email?: string
  address?: string
  avatar?: string
  birthday?: string
  gender?: string
  verified?: boolean
}

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

export interface SetPasswordPayload {
  token: string
  newPassword: string
}

export interface UpdateProfilePayload {
  displayName?: string
  phone?: string
  avatar?: string
  birthday?: string
  address?: string
  gender?: string
  current_password?: string
  new_password?: string
}

export interface AdminProfilePayload {
  displayName?: string
  phone?: string
  avatar?: string | File
  birthday?: string
  address?: string
  gender?: string
}

export interface ChangePasswordPayload {
  oldPassword: string
  newPassword: string
}

export type ForgotPasswordPageState = 'input' | 'success' | 'error'

// Admin User Types
export type AdminUserRole = 'admin' | 'client'

export interface AdminUser {
  _id: string
  email: string
  username?: string
  displayName: string
  phone?: string
  avatar?: string
  role: AdminUserRole
  roleId?: string | null
  address?: string
  gender?: string
  birthday?: string
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

export interface AdminUserQueryParams {
  page?: number
  limit?: number
  keyword?: string
  role?: AdminUserRole
  status?: 'active' | 'inactive'
  sortField?: string
  sortOrder?: 'asc' | 'desc'
}

export interface AdminUserListResponse {
  data: AdminUser[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface AdminUserPayload {
  displayName: string
  email: string
  phone: string
  avatar?: string | File
  role: AdminUserRole
  roleId?: string | null
  address?: string
  gender?: string
  birthday?: string
  isActive?: boolean
}

export interface UserFormData {
  displayName: string
  email: string
  phone: string
  avatar?: string | File
  role: 'admin' | 'client'
  roleId?: string | null
  address?: string
  gender?: string
  birthday?: string
  isActive?: boolean
}

// OAuth / Social Login Types
/** Các provider đăng nhập xã hội được hỗ trợ */
export type OAuthProvider = 'google' | 'facebook'

/** Payload gửi lên /verify-oauth để lấy thông tin user sau khi OAuth redirect */
export interface VerifyOAuthPayload {
  userId: string
}

/** Kiểu đăng nhập của người dùng */
export type LoginType = 'local' | OAuthProvider

/** Cấu hình hiển thị cho từng social button */
export interface SocialLoginOption {
  provider: OAuthProvider
  label: string
  loginUrl: string
  icon: 'google' | 'facebook'
}
