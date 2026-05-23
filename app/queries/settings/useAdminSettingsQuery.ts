import { useQuery } from '@tanstack/vue-query'
import { adminSettingsService } from '~/services/admin/settings.service'

export const adminSettingsKeys = {
  all: ['admin-settings'] as const,
  detail: () => ['admin-settings', 'detail'] as const
}

export const useAdminSettingsQuery = () => {
  return useQuery({
    queryKey: adminSettingsKeys.detail(),
    queryFn: () => adminSettingsService.get()
  })
}
