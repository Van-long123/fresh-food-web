export interface Product {
  id: number | string
  name: string
  image?: string
  price: number
  originalPrice?: number | null
  discountPercent?: number | null
  stock?: number
  slug?: string
}



export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ProductListResponse {
  data: Product[]
  pagination: PaginationMeta
}

export interface ProductQueryParams {
  page?: number
  limit?: number
  sortField?: string
  sortOrder?: 'asc' | 'desc'
  keyword?: string
  status?: string
  featured?: boolean | string
  isBestPrice?: boolean | string
  isOnlineExclusive?: boolean | string
  minPrice?: number
  maxPrice?: number
  primary_category_id?: string
}

export interface ProductReviewUser {
  _id?: string
  displayName?: string
  avatar?: string
}

export interface ProductReview {
  _id: string
  productId: string
  userId: string
  rating: number
  comment: string
  images: string[]
  status: string
  createdAt: string
  user?: ProductReviewUser
}

export interface ProductRatingDistribution {
  star: number
  count: number
}

export interface ProductRatingSummary {
  totalReviews: number
  averageRating: number
  distribution: ProductRatingDistribution[]
}

export interface ProductCategoryInfo {
  _id: string
  title: string
  slug: string
  type?: string
  thumbnail?: string
}

export interface ProductSuggestion {
  _id: string
  title: string
  slug: string
  thumbnail: string
  price: number
  originalPrice: number
  discountPercentage: number
  isOnlineExclusive: boolean
  isBestPrice: boolean
}

export interface ProductDetailResponse {
  _id: string
  title: string
  slug: string
  description: string
  thumbnail: string
  images: string[]
  unit: string
  price: number
  originalPrice: number
  discountPercentage: number
  isOnlineExclusive: boolean
  stock: number
  ratings?: {
    totalRating: number
    numberOfRatings: number
  }
  ratingSummary?: ProductRatingSummary
  primary_category?: ProductCategoryInfo | null
  categories?: ProductCategoryInfo[]
  reviews?: ProductReview[]
  suggestions?: ProductSuggestion[]
}
