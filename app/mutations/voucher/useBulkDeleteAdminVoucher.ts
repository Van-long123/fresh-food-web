import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { adminVoucherService } from '~/services/admin/voucher.service'
import { adminVoucherKeys } from '~/queries/voucher/useAdminVouchersQuery'
import type { AdminVoucherBulkDeletePayload } from '~/types/voucher'

export const useBulkDeleteAdminVoucher = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminVoucherBulkDeletePayload) => adminVoucherService.bulkDelete(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: adminVoucherKeys.all,
        refetchType: 'all',
      })
    },
  })
}