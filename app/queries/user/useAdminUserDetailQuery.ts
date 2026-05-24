import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { adminUserService } from '~/services/admin/user.service'

export const useAdminUserDetailQuery = (userId: string | null) => {
  const enabled = computed(() => Boolean(userId))

  return useQuery({
    queryKey: computed(() => ['admin-users', 'detail', userId]),
    enabled,
    queryFn: () => adminUserService.getDetail(userId as string)
  })
}
