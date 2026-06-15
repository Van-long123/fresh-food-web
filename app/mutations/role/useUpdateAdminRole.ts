import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { adminRoleService } from '~/services/admin/role.service'
import { adminRoleKeys } from '~/queries/role/useAdminRolesQuery'
import type { AdminRolePayload } from '~/types/role.type'

export const useUpdateAdminRole = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<AdminRolePayload> }) =>
      adminRoleService.update(id, payload),
    onSuccess: async (data) => {
      queryClient.removeQueries({ queryKey: adminRoleKeys.all })
      if (data?._id) {
        queryClient.setQueryData(adminRoleKeys.detail(data._id), data)
      }
    }
  })
}
