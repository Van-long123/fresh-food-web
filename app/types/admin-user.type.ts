export type AdminUserStatus = 'active' | 'banned' | 'pending'
export type AdminUserRole = 'admin' | 'staff' | 'customer'

export interface AdminUserListItem {
  id: string
  name: string
  email: string
  role: AdminUserRole
  status: AdminUserStatus
  joinedAt: string
  avatar: string
}

export interface AdminUserForm {
  name: string
  email: string
  phone: string
  role: AdminUserRole
  status: AdminUserStatus
  address: string
  avatar: string
  password?: string
}
