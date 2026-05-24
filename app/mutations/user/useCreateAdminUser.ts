import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { adminUserService } from '~/services/admin/user.service'
import { adminUserKeys } from '~/queries/user/useAdminUsersQuery'
import { adminRoleKeys } from '~/queries/role/useAdminRolesQuery'
import type { AdminUserPayload } from '~/types/user.type'

export const useCreateAdminUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminUserPayload | FormData) => adminUserService.create(payload),
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
