import { API_ENDPOINTS } from '~/constants/api'
import { getAuthorizedAxios } from '~/utils/authorizedAxios'
import type {
  AdminUser,
  AdminUserListResponse,
  AdminUserPayload,
  AdminUserQueryParams
} from '~/types/user.type'

export const getAdminUsersRequest = async (
  params?: AdminUserQueryParams
): Promise<AdminUserListResponse> => {
  const response = await getAuthorizedAxios().get(API_ENDPOINTS.ADMIN.USER.LIST, { params })
  return response.data
}

export const getAdminUserDetailRequest = async (id: string): Promise<AdminUser> => {
  const response = await getAuthorizedAxios().get(API_ENDPOINTS.ADMIN.USER.DETAIL(id))
  return response.data?.data || response.data
}

export const createAdminUserRequest = async (
  payload: AdminUserPayload | FormData
): Promise<AdminUser> => {
  const isFormData = typeof FormData !== 'undefined' && payload instanceof FormData
  const response = await getAuthorizedAxios().post(API_ENDPOINTS.ADMIN.USER.CREATE, payload, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined
  })
  return response.data?.data || response.data
}

export const updateAdminUserRequest = async (
  id: string,
  payload: Partial<AdminUserPayload> | FormData
): Promise<AdminUser> => {
  const isFormData = typeof FormData !== 'undefined' && payload instanceof FormData
  const response = await getAuthorizedAxios().put(API_ENDPOINTS.ADMIN.USER.UPDATE(id), payload, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined
  })
  return response.data?.data || response.data
}

export const deleteAdminUserRequest = async (id: string): Promise<AdminUser> => {
  const response = await getAuthorizedAxios().delete(API_ENDPOINTS.ADMIN.USER.DELETE(id))
  return response.data?.data || response.data
}

export const bulkDeleteAdminUsersRequest = async (userIds: string[]) => {
  const response = await getAuthorizedAxios().delete(API_ENDPOINTS.ADMIN.USER.BULK_DELETE, {
    data: { user_ids: userIds }
  })
  return response.data
}

export const bulkUpdateAdminUsersStatusRequest = async (userIds: string[], isActive: boolean) => {
  const response = await getAuthorizedAxios().put(API_ENDPOINTS.ADMIN.USER.BULK_STATUS, {
    user_ids: userIds,
    isActive
  })
  return response.data
}
