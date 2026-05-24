import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { adminUserService } from '~/services/admin/user.service'
import { adminUserKeys } from '~/queries/user/useAdminUsersQuery'
import { adminRoleKeys } from '~/queries/role/useAdminRolesQuery'

export const useDeleteAdminUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => adminUserService.delete(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: adminUserKeys.all,
        refetchType: 'all'
      })
      await queryClient.invalidateQueries({
        queryKey: adminRoleKeys.all,
        refetchType: 'all'
      })
    }
  })
}
