import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { adminVoucherService } from '~/services/admin/voucher.service'
import { adminVoucherKeys } from '~/queries/voucher/useAdminVouchersQuery'

export const useDeleteAdminVoucher = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => adminVoucherService.delete(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: adminVoucherKeys.all,
        refetchType: 'all',
      })
    },
  })
}