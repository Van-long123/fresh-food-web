import { useQuery } from '@tanstack/vue-query'
import { getClientSettingsRequest } from '~/api/client/settingsApi'

// DEFAULT_SETTINGS được định nghĩa 1 chỗ duy nhất trong store
export { DEFAULT_SETTINGS } from '~/stores/useSettingsStore'

export const clientSettingsKeys = {
  all: ['client-settings'] as const,
  detail: () => ['client-settings'] as const
}

/**
 * Hook lấy cấu hình website công khai (không yêu cầu đăng nhập).
 * staleTime = 10 phút để tránh gọi lại API quá nhiều trong một phiên làm việc.
 */
export const useClientSettingsQuery = () => {
  return useQuery({
    queryKey: clientSettingsKeys.detail(),
    queryFn: () => getClientSettingsRequest(),
    staleTime: 10 * 60 * 1000
  })
}
