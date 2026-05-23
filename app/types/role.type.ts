export interface AdminRole {
  _id: string
  title: string
  description: string
  permissions: string[]
  usersCount?: number
  permissionsCount?: number
  isSystem?: boolean
  createdAt?: string
  updatedAt?: string | null
}

export interface AdminRoleQueryParams {
  page?: number
  limit?: number
  keyword?: string
  sortField?: string
  sortOrder?: 'asc' | 'desc'
}

export interface AdminRoleListResponse {
  data: AdminRole[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface AdminRolePayload {
  title: string
  description: string
  permissions: string[]
}
