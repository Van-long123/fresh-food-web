import type { HomeProduct } from '~/types/home.type'

export type CategoryProductsFilter = 'all' | 'best' | 'discount' | 'new'

export type CategoryProductsSortBy =
  | 'popular'
  | 'priceAsc'
  | 'priceDesc'
  | 'discountDesc'

export interface CategorySummary {
  id: string
  slug: string
  title: string
  thumbnail: string
  parent_id: string | null
}

export interface RelatedCategory {
  id: string
  slug: string
  title: string
  thumbnail: string
}

export interface CategoryProduct extends HomeProduct {
  sold: number
  isNew: boolean
  brand: string | null
}

export interface CategoryProductsQueryParams {
  page?: number
  limit?: number
  filter?: CategoryProductsFilter
  sortBy?: CategoryProductsSortBy
  minPrice?: number
  maxPrice?: number
  brands?: string[] | string
}

export interface CategoryProductsApiResponse {
  category: CategorySummary
  relatedCategories: RelatedCategory[]
  products: CategoryProduct[]
  priceStats: {
    minPrice: number
    maxPrice: number
  }
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
