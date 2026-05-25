import { API_ENDPOINTS } from '~/constants/api'
import { getAuthorizedAxios } from '~/utils/authorizedAxios'
import type {
  AdminVoucher,
  AdminVoucherBulkDeletePayload,
  AdminVoucherBulkStatusPayload,
  AdminVoucherListResponse,
  AdminVoucherPayload,
  AdminVoucherQueryParams,
} from '~/types/voucher'

export const getAdminVouchersRequest = async (
  params?: AdminVoucherQueryParams,
): Promise<AdminVoucherListResponse> => {
  const response = await getAuthorizedAxios().get(API_ENDPOINTS.ADMIN.VOUCHER.LIST, {
    params,
  })
  return response.data
}

export const getAdminVoucherDetailRequest = async (id: string): Promise<AdminVoucher> => {
  const response = await getAuthorizedAxios().get(API_ENDPOINTS.ADMIN.VOUCHER.DETAIL(id))
  return response.data?.data || response.data
}

export const createAdminVoucherRequest = async (
  payload: AdminVoucherPayload,
): Promise<AdminVoucher> => {
  const response = await getAuthorizedAxios().post(API_ENDPOINTS.ADMIN.VOUCHER.CREATE, payload)
  return response.data?.data || response.data
}

export const updateAdminVoucherRequest = async (
  id: string,
  payload: Partial<AdminVoucherPayload>,
): Promise<AdminVoucher> => {
  const response = await getAuthorizedAxios().put(API_ENDPOINTS.ADMIN.VOUCHER.UPDATE(id), payload)
  return response.data?.data || response.data
}

export const deleteAdminVoucherRequest = async (id: string): Promise<AdminVoucher> => {
  const response = await getAuthorizedAxios().delete(API_ENDPOINTS.ADMIN.VOUCHER.DELETE(id))
  return response.data?.data || response.data
}

export const updateAdminVoucherBulkStatusRequest = async (
  payload: AdminVoucherBulkStatusPayload,
): Promise<{ updatedCount: number }> => {
  const response = await getAuthorizedAxios().put(API_ENDPOINTS.ADMIN.VOUCHER.BULK_STATUS, payload)
  return response.data
}

export const deleteAdminVouchersBulkRequest = async (
  payload: AdminVoucherBulkDeletePayload,
): Promise<{ deletedCount: number }> => {
  const response = await getAuthorizedAxios().delete(API_ENDPOINTS.ADMIN.VOUCHER.BULK_DELETE, {
    data: payload,
  })
  return response.data
}