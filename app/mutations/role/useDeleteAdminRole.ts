import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { adminRoleService } from '~/services/admin/role.service'
import { adminRoleKeys } from '~/queries/role/useAdminRolesQuery'

export const useDeleteAdminRole = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => adminRoleService.delete(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: adminRoleKeys.all,
        refetchType: 'all'
      })
    }
  })
}
