import { API_ENDPOINTS } from '~/constants/api'
import { getAuthorizedAxios } from '~/utils/authorizedAxios'
import type { AdminSettings, AdminSettingsPayload } from '~/types/settings.type'

export const getAdminSettingsRequest = async (): Promise<AdminSettings> => {
  const response = await getAuthorizedAxios().get(API_ENDPOINTS.ADMIN.SETTINGS.GET)
  return response.data
}

export const updateAdminSettingsRequest = async (
  payload: AdminSettingsPayload | FormData
): Promise<AdminSettings> => {
  const isFormData = typeof FormData !== 'undefined' && payload instanceof FormData
  const response = await getAuthorizedAxios().put(API_ENDPOINTS.ADMIN.SETTINGS.UPDATE, payload, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined
  })
  return response.data
}
