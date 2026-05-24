import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { adminUserService } from '~/services/admin/user.service'
import { adminUserKeys } from '~/queries/user/useAdminUsersQuery'
import { adminRoleKeys } from '~/queries/role/useAdminRolesQuery'

export const useBulkDeleteAdminUsers = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) => adminUserService.deleteMany(ids),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: adminUserKeys.all,
        // Hãy xóa cái cache này đi và gọi lại API ngầm ở dưới nền (background) NGAY LẬP TỨC 
        refetchType: 'all'
      })
      await queryClient.invalidateQueries({
        queryKey: adminRoleKeys.all,
        refetchType: 'all'
      })
    }
  })
}
