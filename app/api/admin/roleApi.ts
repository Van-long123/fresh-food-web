import { API_ENDPOINTS } from '~/constants/api'
import { getAuthorizedAxios } from '~/utils/authorizedAxios'
import type {
  AdminRole,
  AdminRoleListResponse,
  AdminRolePayload,
  AdminRoleQueryParams
} from '~/types/role.type'

export const getAdminRolesRequest = async (
  params?: AdminRoleQueryParams
): Promise<AdminRoleListResponse> => {
  const response = await getAuthorizedAxios().get(API_ENDPOINTS.ADMIN.ROLE.LIST, { params })
  return response.data
}

export const getAdminRoleDetailRequest = async (id: string): Promise<AdminRole> => {
  const response = await getAuthorizedAxios().get(API_ENDPOINTS.ADMIN.ROLE.DETAIL(id))
  return response.data?.data || response.data
}

export const createAdminRoleRequest = async (payload: AdminRolePayload): Promise<AdminRole> => {
  const response = await getAuthorizedAxios().post(API_ENDPOINTS.ADMIN.ROLE.CREATE, payload)
  return response.data?.data || response.data
}

export const updateAdminRoleRequest = async (
  id: string,
  payload: Partial<AdminRolePayload>
): Promise<AdminRole> => {
  const response = await getAuthorizedAxios().put(API_ENDPOINTS.ADMIN.ROLE.UPDATE(id), payload)
  return response.data?.data || response.data
}

export const deleteAdminRoleRequest = async (id: string): Promise<AdminRole> => {
  const response = await getAuthorizedAxios().delete(API_ENDPOINTS.ADMIN.ROLE.DELETE(id))
  return response.data?.data || response.data
}

export const deleteAdminRolesRequest = async (ids: string[]): Promise<{ deletedCount: number }> => {
  const response = await getAuthorizedAxios().delete(API_ENDPOINTS.ADMIN.ROLE.DELETE_MANY, {
    data: { ids }
  })
  return response.data
}
