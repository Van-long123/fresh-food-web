import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { adminVoucherService } from '~/services/admin/voucher.service'
import { adminVoucherKeys } from '~/queries/voucher/useAdminVouchersQuery'
import type { AdminVoucherBulkStatusPayload } from '~/types/voucher'

export const useBulkUpdateAdminVoucherStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminVoucherBulkStatusPayload) => adminVoucherService.bulkUpdateStatus(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: adminVoucherKeys.all,
        refetchType: 'all',
      })
    },
  })
}