import { API_ENDPOINTS } from '~/constants/api'
import { getAuthorizedAxios } from '~/utils/authorizedAxios'
import type {
  AdminOrder,
  AdminOrderListResponse,
  AdminOrderQueryParams,
  AdminPayment,
  AdminPaymentListResponse,
  AdminPaymentQueryParams,
  AdminPaymentStats,
} from '~/types/order.type'

// ── Orders ────────────────────────────────────────────────────

export const getAdminOrdersRequest = async (
  params?: AdminOrderQueryParams,
): Promise<AdminOrderListResponse> => {
  const response = await getAuthorizedAxios().get(API_ENDPOINTS.ADMIN.ORDER.LIST, { params })
  return response.data
}

export const getAdminOrderDetailRequest = async (id: string): Promise<AdminOrder> => {
  const response = await getAuthorizedAxios().get(API_ENDPOINTS.ADMIN.ORDER.DETAIL(id))
  return response.data?.data || response.data
}

export const updateAdminOrderStatusRequest = async (
  id: string,
  status: string,
): Promise<AdminOrder> => {
  const response = await getAuthorizedAxios().put(API_ENDPOINTS.ADMIN.ORDER.UPDATE_STATUS(id), {
    status,
  })
  return response.data?.data || response.data
}

export const bulkUpdateAdminOrderStatusRequest = async (
  payload: { order_ids: string[]; status: string },
): Promise<{ updatedCount: number }> => {
  const response = await getAuthorizedAxios().put(API_ENDPOINTS.ADMIN.ORDER.BULK_STATUS, payload)
  return response.data?.data || response.data
}

// ── Payments ──────────────────────────────────────────────────

export const getAdminPaymentsRequest = async (
  params?: AdminPaymentQueryParams,
): Promise<AdminPaymentListResponse> => {
  const response = await getAuthorizedAxios().get(API_ENDPOINTS.ADMIN.PAYMENT.LIST, { params })
  return response.data
}

export const getAdminPaymentStatsRequest = async (): Promise<AdminPaymentStats> => {
  const response = await getAuthorizedAxios().get(API_ENDPOINTS.ADMIN.PAYMENT.STATS)
  return response.data?.data || response.data
}

export const confirmAdminCodPaymentRequest = async (id: string): Promise<{ success: boolean; message: string }> => {
  const response = await getAuthorizedAxios().put(API_ENDPOINTS.ADMIN.PAYMENT.CONFIRM_COD(id))
  return response.data
}
