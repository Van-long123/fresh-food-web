import {
  approveAdminRefundRequest,
  completeAdminRefundRequest,
  getAdminRefundRequestDetailRequest,
  getAdminRefundRequestsRequest,
  rejectAdminRefundRequest
} from '~/api/admin/refundRequestApi'
import type {
  AdminRefundRequestDetail,
  AdminRefundRequestListResponse,
  AdminRefundRequestQueryParams
} from '~/types/refund.type'

export const adminRefundRequestService = {
  getRequests: (params?: AdminRefundRequestQueryParams): Promise<AdminRefundRequestListResponse> =>
    getAdminRefundRequestsRequest(params),

  getDetail: (id: string): Promise<AdminRefundRequestDetail> =>
    getAdminRefundRequestDetailRequest(id),

  approve: (id: string): Promise<AdminRefundRequestDetail> => approveAdminRefundRequest(id),

  reject: (id: string, reason: string): Promise<AdminRefundRequestDetail> =>
    rejectAdminRefundRequest(id, reason),

  complete: (id: string, payload: FormData | Record<string, any>): Promise<AdminRefundRequestDetail> =>
    completeAdminRefundRequest(id, payload)
}
