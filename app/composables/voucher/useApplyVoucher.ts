import { ref } from 'vue'
import { useCart } from '~/composables/cart/useCart'
import { useValidateVoucherMutation } from '~/mutations/voucher/useValidateVoucherMutation'
import type { VoucherValidationItem, VoucherValidationResponse } from '~/types/voucher'

export const useApplyVoucher = () => {
  const { triggerNotice } = useCart()
  
  const appliedVoucher = ref<VoucherValidationResponse['voucher'] | null>(null)
  const voucherDiscount = ref<number>(0)
  const voucherBreakdown = ref<Record<string, number>>({})
  const eligibleSubtotal = ref<number>(0)

  const applyVoucherMutation = useValidateVoucherMutation()
  
  const applyVoucher = (payload: { code: string; orderValue: number; items?: VoucherValidationItem[] }, options: { silent?: boolean } = {}) => {
    applyVoucherMutation.mutate(payload, {
      onSuccess: (data) => {
        appliedVoucher.value = data.voucher
        voucherDiscount.value = data.discountAmount
        voucherBreakdown.value = data.discountBreakdown || {}
        eligibleSubtotal.value = data.eligibleSubtotal || 0
        if (!options.silent) {
          triggerNotice(`Đã áp dụng mã giảm giá ${data.voucher.code}`, 'Thành công')
        }
      },
      onError: (error: unknown) => {
        if (options.silent) return
        const message =
          typeof error === 'object' && error !== null && 'response' in error
            ? ((error as { response?: { data?: { message?: string } } }).response?.data?.message || 'Không thể áp dụng voucher')
            : 'Không thể áp dụng voucher'
        triggerNotice(message, 'Thông báo')
      },
    })
  }

  const removeVoucher = (options: { silent?: boolean; message?: string } = {}) => {
    appliedVoucher.value = null
    voucherDiscount.value = 0
    voucherBreakdown.value = {}
    eligibleSubtotal.value = 0
    if (!options.silent) {
      triggerNotice(options.message || 'Đã bỏ áp dụng mã giảm giá', 'Thông báo')
    }
  }



  return {
    appliedVoucher,
    voucherDiscount,
    voucherBreakdown,
    eligibleSubtotal,
    isApplying: applyVoucherMutation.isPending,
    applyVoucher,
    removeVoucher
  }
}

