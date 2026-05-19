import { useMutation } from '@tanstack/vue-query'
import { voucherService } from '~/services/voucher.service'
import type { VoucherValidationItem } from '~/types/voucher'

export const useValidateVoucherMutation = () => {
  return useMutation({
    mutationFn: (payload: { code: string; orderValue: number; items?: VoucherValidationItem[]; shippingFee?: number }) => {
      return voucherService.validate(payload)
    },
    retry: false
  })
}
