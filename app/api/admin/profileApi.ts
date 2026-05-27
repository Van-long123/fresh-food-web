import { API_ENDPOINTS } from '~/constants/api'
import { getAuthorizedAxios } from '~/utils/authorizedAxios'
import type { AdminProfilePayload, ChangePasswordPayload } from '~/types/user.type'

export const getAdminAuthMeRequest = async () => {
  const response = await getAuthorizedAxios().get(API_ENDPOINTS.ADMIN.AUTH.ME)
  return response.data
}

export const updateAdminProfileRequest = async (payload: AdminProfilePayload | FormData) => {
  const isFormData = typeof FormData !== 'undefined' && payload instanceof FormData
  const response = await getAuthorizedAxios().put(API_ENDPOINTS.ADMIN.PROFILE.UPDATE, payload, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined
  })
  return response.data
}

export const changeAdminPasswordRequest = async (payload: ChangePasswordPayload) => {
  const response = await getAuthorizedAxios().put(API_ENDPOINTS.ADMIN.PROFILE.CHANGE_PASSWORD, payload)
  return response.data
}