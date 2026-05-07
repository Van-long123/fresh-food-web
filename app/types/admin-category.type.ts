export type AdminCategoryStatus = 'active' | 'inactive'

export interface AdminCategoryListItem {
  id: string
  title: string
  slug: string
  parent: string | null
  productCount: number
  status: AdminCategoryStatus
  position: number
  thumbnail: string
}

export interface AdminCategoryForm {
  title: string
  slug: string
  parentId: string | null
  description: string
  position: number
  status: AdminCategoryStatus
  thumbnail: string
}
