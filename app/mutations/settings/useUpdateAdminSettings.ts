import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { adminSettingsService } from '~/services/admin/settings.service'
import { adminSettingsKeys } from '~/queries/settings/useAdminSettingsQuery'
import type { AdminSettingsPayload } from '~/types/settings.type'

export const useUpdateAdminSettings = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminSettingsPayload) => adminSettingsService.update(payload),
    onSuccess: async () => {
      // Invalidate the settings query to re-fetch fresh data from the server
      await queryClient.invalidateQueries({ queryKey: adminSettingsKeys.all })
    }
  })
}
