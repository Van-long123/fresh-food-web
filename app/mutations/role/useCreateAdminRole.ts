import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { adminRoleService } from '~/services/admin/role.service'
import { adminRoleKeys } from '~/queries/role/useAdminRolesQuery'
import type { AdminRolePayload } from '~/types/role.type'

export const useCreateAdminRole = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminRolePayload) => adminRoleService.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: adminRoleKeys.all,
        refetchType: 'all'
      })
    }
  })
}
