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
  rejectReason?: string | null
  createdAt: string
  updatedAt?: string | null
  user?: ProductReviewUser
}

export interface ReviewEligibilityResponse {
  success: boolean
  isEligible: boolean
  existingReview: ProductReview | null
  targetOrderId?: string | null
}

export interface SubmitReviewPayload {
  rating: number
  comment: string
  images?: string[]
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
}

// Recommendation API (Python microservice → Node.js → Frontend)

export interface ProductRecommendationItem {
  _id: string
  title: string
  slug: string | null
  price: number
  images: string[]
  ratings: {
    totalRating: number
    numberOfRatings: number
  }
  primary_category_id: string | null
  featured: boolean
  isBestPrice: boolean
  isOnlineExclusive: boolean
  similarity_score: number
}

export interface ProductRecommendationResponse {
  success: boolean
  product_id: string
  total: number
  recommendations: ProductRecommendationItem[]
}

// Admin Product Types

export interface AdminProduct {
  _id: string
  title: string
  slug: string
  description: string
  thumbnail: string
  images: string[]
  stock: number
  unit: string
  price: number
  discountPercentage: number
  originalPrice: number
  status: 'active' | 'inactive'
  featured: boolean
  isBestPrice: boolean
  isOnlineExclusive: boolean
  tags: string[]
  ratings: { totalRating: number; numberOfRatings: number }
  soldCount: number
  position: number
  primary_category_id: string | null
  primary_category?: ProductCategoryInfo | null
  categories?: ProductCategoryInfo[]
  createdAt?: string
  updatedAt?: string | null
}

export interface AdminProductListResponse {
  data: AdminProduct[]
  pagination: PaginationMeta
}

export interface AdminProductQueryParams {
  page?: number
  limit?: number
  sortField?: string
  sortOrder?: 'asc' | 'desc'
  keyword?: string
  status?: string
  primary_category_id?: string
  featured?: boolean | string
}

export interface AdminProductPayload {
  title: string
  slug?: string
  description?: string
  thumbnail?: string
  images?: string[]
  stock?: number
  unit?: string
  price: number
  discountPercentage?: number
  originalPrice?: number
  status?: 'active' | 'inactive'
  featured?: boolean
  isBestPrice?: boolean
  isOnlineExclusive?: boolean
  tags?: string[]
  position?: number
  primary_category_id?: string | null
  category_ids?: string[]
}

export interface AdminCategoryOption {
  _id: string
  title: string
  slug: string
  type: string
  status: string
}

export interface AdminCategoryListResponse {
  data: AdminCategoryOption[]
  pagination: PaginationMeta
}
