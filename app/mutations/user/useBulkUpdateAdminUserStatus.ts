import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { adminUserService } from '~/services/admin/user.service'
import { adminUserKeys } from '~/queries/user/useAdminUsersQuery'

export const useBulkUpdateAdminUserStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ ids, isActive }: { ids: string[]; isActive: boolean }) =>
      adminUserService.updateStatusMany(ids, isActive),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: adminUserKeys.all,
        refetchType: 'all'
      })
    }
  })
}
