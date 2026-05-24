import { API_ENDPOINTS } from '~/constants/api'
import { getAuthorizedAxios } from '~/utils/authorizedAxios'
import type { VoucherValidationItem, VoucherValidationResponse } from '~/types/voucher'

export interface VoucherListQueryParams {
  type?: 'money' | 'percent' | 'freeship' | 'product'
  isFeatured?: boolean
  page?: number
  limit?: number
}

export const getVoucherListRequest = async (
  params: VoucherListQueryParams = {}
): Promise<any> => {
  const response = await getAuthorizedAxios().get(API_ENDPOINTS.VOUCHER.LIST, { params })
  return response.data
}

export const validateVoucherRequest = async (payload: { code: string; orderValue: number; items?: VoucherValidationItem[]; shippingFee?: number }): Promise<VoucherValidationResponse> => {
  const response = await getAuthorizedAxios().post(API_ENDPOINTS.VOUCHER.VALIDATE, payload)
  return response.data
}

