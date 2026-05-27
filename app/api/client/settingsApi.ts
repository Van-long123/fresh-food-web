import { API_ENDPOINTS } from '~/constants/api'
import { getAuthorizedAxios } from '~/utils/authorizedAxios'
import type { AdminSettings } from '~/types/settings.type'

/**
 * Lấy cấu hình website công khai (không cần token).
 * Endpoint: GET /v1/client/settings */
export const getClientSettingsRequest = async (): Promise<AdminSettings> => {
  const response = await getAuthorizedAxios().get(API_ENDPOINTS.SETTINGS.GET)
  return response.data
}
