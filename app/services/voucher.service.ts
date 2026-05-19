import { getVoucherListRequest, validateVoucherRequest, type VoucherListQueryParams } from '~/api/voucher.api'
import type { VoucherValidationItem } from '~/types/voucher'

export const voucherService = {
  getList: (params: VoucherListQueryParams = {}) => getVoucherListRequest(params),
  validate: (payload: { code: string; orderValue: number; items?: VoucherValidationItem[]; shippingFee?: number }) => validateVoucherRequest(payload)
}
