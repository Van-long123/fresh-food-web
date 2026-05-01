import { getVoucherListRequest, type VoucherListQueryParams } from '~/api/voucher.api'

export const voucherService = {
  getList: (params: VoucherListQueryParams = {}) => getVoucherListRequest(params)
}
