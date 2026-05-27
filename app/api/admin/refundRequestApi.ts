import { API_ENDPOINTS } from '~/constants/api'
import { getAuthorizedAxios } from '~/utils/authorizedAxios'
import type {
  AdminRefundRequestDetail,
  AdminRefundRequestListResponse,
  AdminRefundRequestQueryParams
} from '~/types/refund.type'

export const getAdminRefundRequestsRequest = async (
  params?: AdminRefundRequestQueryParams
): Promise<AdminRefundRequestListResponse> => {
  const response = await getAuthorizedAxios().get(API_ENDPOINTS.ADMIN.REFUND.LIST, { params })
  return response.data
}

export const getAdminRefundRequestDetailRequest = async (
  id: string
): Promise<AdminRefundRequestDetail> => {
  const response = await getAuthorizedAxios().get(API_ENDPOINTS.ADMIN.REFUND.DETAIL(id))
  return response.data?.data || response.data
}

export const approveAdminRefundRequest = async (id: string): Promise<AdminRefundRequestDetail> => {
  const response = await getAuthorizedAxios().put(API_ENDPOINTS.ADMIN.REFUND.APPROVE(id))
  return response.data?.data || response.data
}

export const rejectAdminRefundRequest = async (
  id: string,
  reason: string
): Promise<AdminRefundRequestDetail> => {
  const response = await getAuthorizedAxios().put(API_ENDPOINTS.ADMIN.REFUND.REJECT(id), {
    reason
  })
  return response.data?.data || response.data
}

export const completeAdminRefundRequest = async (
  id: string,
  payload: FormData | Record<string, any>
): Promise<AdminRefundRequestDetail> => {
  const isFormData = typeof FormData !== 'undefined' && payload instanceof FormData
  const response = await getAuthorizedAxios().put(API_ENDPOINTS.ADMIN.REFUND.COMPLETE(id), payload, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined
  })
  return response.data?.data || response.data
}
