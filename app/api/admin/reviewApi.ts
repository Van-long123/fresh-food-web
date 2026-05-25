import { API_ENDPOINTS } from '~/constants/api'
import { getAuthorizedAxios } from '~/utils/authorizedAxios'
import type {
  AdminReviewListResponse,
  AdminReview,
  AdminReviewQueryParams,
  AdminReviewStatusPayload
} from '~/types/review.type'

export const getAdminReviewsRequest = async (params?: AdminReviewQueryParams): Promise<AdminReviewListResponse> => {
  const response = await getAuthorizedAxios().get(API_ENDPOINTS.ADMIN.REVIEW.LIST, { params })
  return response.data
}

export const getAdminReviewDetailRequest = async (id: string): Promise<AdminReview> => {
  const response = await getAuthorizedAxios().get(API_ENDPOINTS.ADMIN.REVIEW.DETAIL(id))
  return response.data
}

export const updateAdminReviewStatusRequest = async (id: string, payload: AdminReviewStatusPayload): Promise<AdminReview> => {
  const response = await getAuthorizedAxios().put(API_ENDPOINTS.ADMIN.REVIEW.UPDATE_STATUS(id), payload)
  return response.data
}
