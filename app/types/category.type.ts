export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface AdminCategoryParent {
  _id: string
  title: string
  slug: string
  type: 'product' | 'article'
}

export interface AdminCategory {
  _id: string
  title: string
  slug: string
  type: 'product' | 'article'
  description: string
  thumbnail: string
  bannerImage: string
  badgeText: string
  status: 'active' | 'inactive'
  featured: boolean
  position: number
  parent_id: string | null
  parent?: AdminCategoryParent | null
  deleted?: boolean
  createdAt?: string
  updatedAt?: string | null
}

export interface AdminCategoryListResponse {
  data: AdminCategory[]
  pagination: PaginationMeta
}

export interface AdminCategoryQueryParams {
  page?: number
  limit?: number
  sortField?: string
  sortOrder?: 'asc' | 'desc'
  searchQuery?: string
  statusFilter?: 'all' | 'active' | 'inactive' | string
  typeFilter?: 'all' | 'product' | 'article' | string
}

export interface AdminCategoryPayload {
  title: string
  slug?: string
  type: 'product' | 'article'
  description?: string
  thumbnail?: string | File
  bannerImage?: string | File
  badgeText?: string
  status?: 'active' | 'inactive'
  featured?: boolean
  position?: number | null
  parent_id?: string | null
}

export interface CategoryFormData {
  title: string
  slug: string
  type: 'product' | 'article'
  description: string
  thumbnail: string | File
  bannerImage: string | File
  badgeText: string
  status: 'active' | 'inactive'
  featured: boolean
  position: number | null
  parent_id: string | null
}