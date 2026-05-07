export type AdminReviewStatus = 'pending' | 'approved' | 'rejected'

export interface AdminReviewListItem {
  id: string
  product: string
  user: string
  rating: number
  comment: string
  status: AdminReviewStatus
  createdAt: string
}
