import { API_ENDPOINTS } from '~/constants/api'
import { getAuthorizedAxios } from '~/utils/authorizedAxios'

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
