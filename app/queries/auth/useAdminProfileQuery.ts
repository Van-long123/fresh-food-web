import { useQuery } from '@tanstack/vue-query'
import { adminProfileService } from '~/services/admin/profile.service'

export const adminAuthKeys = {
  all: ['admin-auth'] as const,
  me: () => ['admin-auth', 'me'] as const
}

export const useAdminProfileQuery = () => {
  return useQuery({
    queryKey: adminAuthKeys.me(),
    queryFn: () => adminProfileService.getMe(),
    staleTime: 1000 * 60 * 5
  })
}
