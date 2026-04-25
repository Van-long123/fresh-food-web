export interface Article {
  _id: string
  title: string
  slug: string
  shortDescription: string
  content: string
  thumbnail: string
  authorName: string
  readTime: number
  views: number
  publishedAt: string | null
  status: 'active' | 'draft' | 'inactive'
  featured: boolean
  position: number
  primary_category_id: string | null
  tags: string[]
  deleted: boolean
  createdAt: string
  updatedAt: string
}

export interface Category {
  _id: string
  title: string
  slug: string
  type: string
  description: string
  thumbnail: string
  status: string
  featured: boolean
  position: number
  parent_id: string | null
  deleted: boolean
  createdAt: string
  updatedAt: string
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ArticleStats {
  totalViews: number
  totalAuthors: number
}

export interface ArticleListResponse {
  data: Article[]
  pagination: Pagination
  stats: ArticleStats
}

export interface CategoryListResponse {
  data: Category[]
  pagination: Pagination
}

export interface ArticleListQueryParams {
  page?: number
  limit?: number
  sortField?: string
  sortOrder?: 'asc' | 'desc'
  featured?: boolean
  primary_category_id?: string
  keyword?: string
}

export interface CategoryListQueryParams {
  page?: number
  limit?: number
  type?: string
  featured?: boolean
}
