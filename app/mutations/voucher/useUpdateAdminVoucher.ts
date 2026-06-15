import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { adminVoucherService } from '~/services/admin/voucher.service'
import { adminVoucherKeys } from '~/queries/voucher/useAdminVouchersQuery'
import type { AdminVoucherFormValues } from '~/types/voucher'

export const useUpdateAdminVoucher = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AdminVoucherFormValues }) =>
      adminVoucherService.update(id, payload),
    onSuccess: async (data) => {
      queryClient.removeQueries({ queryKey: adminVoucherKeys.all })
      if (data?._id) {
        queryClient.setQueryData(adminVoucherKeys.detail(data._id), data)
      }
    },
  })
}