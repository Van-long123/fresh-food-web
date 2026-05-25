import {
  getAdminReviewsRequest,
  getAdminReviewDetailRequest,
  updateAdminReviewStatusRequest
} from '~/api/admin/reviewApi'
import type {
  AdminReviewListResponse,
  AdminReview,
  AdminReviewQueryParams,
  AdminReviewStatusPayload
} from '~/types/review.type'

export const adminReviewService = {
  getList: (params?: AdminReviewQueryParams): Promise<AdminReviewListResponse> =>
    getAdminReviewsRequest(params),

  getDetail: (id: string): Promise<AdminReview> =>
    getAdminReviewDetailRequest(id),

  updateStatus: (id: string, payload: AdminReviewStatusPayload): Promise<AdminReview> =>
    updateAdminReviewStatusRequest(id, payload)
}
