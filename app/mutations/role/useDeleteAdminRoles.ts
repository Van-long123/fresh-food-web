import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { adminRoleService } from '~/services/admin/role.service'
import { adminRoleKeys } from '~/queries/role/useAdminRolesQuery'

export const useDeleteAdminRoles = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) => adminRoleService.deleteMany(ids),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: adminRoleKeys.all,
        refetchType: 'all'
      })
    }
  })
}
