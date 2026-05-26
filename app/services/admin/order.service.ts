import {
  bulkUpdateAdminOrderStatusRequest,
  confirmAdminCodPaymentRequest,
  getAdminOrderDetailRequest,
  getAdminOrdersRequest,
  getAdminPaymentStatsRequest,
  getAdminPaymentsRequest,
  updateAdminOrderStatusRequest,
} from '~/api/admin/orderApi'
import type {
  AdminOrder,
  AdminOrderListResponse,
  AdminOrderQueryParams,
  AdminPaymentListResponse,
  AdminPaymentQueryParams,
  AdminPaymentStats,
} from '~/types/order.type'

export const adminOrderService = {
  getOrders: (params?: AdminOrderQueryParams): Promise<AdminOrderListResponse> =>
    getAdminOrdersRequest(params),

  getDetail: (id: string): Promise<AdminOrder> => getAdminOrderDetailRequest(id),

  updateStatus: (id: string, status: string): Promise<AdminOrder> =>
    updateAdminOrderStatusRequest(id, status),

  bulkUpdateStatus: (payload: { order_ids: string[]; status: string }): Promise<{ updatedCount: number }> =>
    bulkUpdateAdminOrderStatusRequest(payload),

  getPayments: (params?: AdminPaymentQueryParams): Promise<AdminPaymentListResponse> =>
    getAdminPaymentsRequest(params),

  getPaymentStats: (): Promise<AdminPaymentStats> => getAdminPaymentStatsRequest(),

  confirmCod: (id: string): Promise<{ success: boolean; message: string }> =>
    confirmAdminCodPaymentRequest(id),
}
