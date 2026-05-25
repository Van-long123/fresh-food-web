export type AdminReview = {
  id: string
  productId: string
  userId: string
  productName: string
  customerName: string
  rating: number
  comment: string
  images: string[]
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  updatedAt?: string | null
}

export interface AdminReviewQueryParams {
  page?: number
  limit?: number
  sortField?: string
  sortOrder?: 'asc' | 'desc'
  keyword?: string
  status?: 'pending' | 'approved' | 'rejected'
  rating?: number
}

export interface AdminReviewRatingStat {
  star: number
  count: number
}

export interface AdminReviewListResponse {
  data: AdminReview[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  stats: AdminReviewRatingStat[]
}

export interface AdminReviewStatusPayload {
  status: 'pending' | 'approved' | 'rejected'
}
