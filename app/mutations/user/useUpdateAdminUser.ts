import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { adminUserService } from '~/services/admin/user.service'
import { adminUserKeys } from '~/queries/user/useAdminUsersQuery'
import { adminRoleKeys } from '~/queries/role/useAdminRolesQuery'
import type { AdminUserPayload } from '~/types/user.type'

export const useUpdateAdminUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<AdminUserPayload> | FormData }) =>
      adminUserService.update(id, payload),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: adminUserKeys.all,
        refetchType: 'all'
      })
      await queryClient.invalidateQueries({
        queryKey: adminRoleKeys.all,
        refetchType: 'all'
      })
      if (data?._id) {
        queryClient.setQueryData(adminUserKeys.detail(data._id), data)
      }
    }
  })
}
