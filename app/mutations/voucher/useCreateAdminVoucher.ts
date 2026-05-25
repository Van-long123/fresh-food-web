import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { adminVoucherService } from '~/services/admin/voucher.service'
import { adminVoucherKeys } from '~/queries/voucher/useAdminVouchersQuery'
import type { AdminVoucherFormValues } from '~/types/voucher'

export const useCreateAdminVoucher = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminVoucherFormValues) => adminVoucherService.create(payload),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: adminVoucherKeys.all,
        refetchType: 'all',
      })
      if (data?._id) {
        queryClient.setQueryData(adminVoucherKeys.detail(data._id), data)
      }
    },
  })
}