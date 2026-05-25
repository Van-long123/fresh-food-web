import { API_ENDPOINTS } from '~/constants/api'
import { getAuthorizedAxios } from '~/utils/authorizedAxios'
import type {
  AdminCategory,
  AdminCategoryListResponse,
  AdminCategoryPayload,
  AdminCategoryQueryParams
} from '~/types/category.type'

export const getAdminCategoriesRequest = async (
  params?: AdminCategoryQueryParams
): Promise<AdminCategoryListResponse> => {
  const response = await getAuthorizedAxios().get(API_ENDPOINTS.ADMIN.CATEGORY.LIST, { params })
  return response.data
}

export const getAdminCategoryDetailRequest = async (id: string): Promise<AdminCategory> => {
  const response = await getAuthorizedAxios().get(API_ENDPOINTS.ADMIN.CATEGORY.DETAIL(id))
  return response.data?.data || response.data
}

export const createAdminCategoryRequest = async (
  payload: AdminCategoryPayload | FormData
): Promise<AdminCategory> => {
  const isFormData = typeof FormData !== 'undefined' && payload instanceof FormData
  const response = await getAuthorizedAxios().post(API_ENDPOINTS.ADMIN.CATEGORY.CREATE, payload, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined
  })
  return response.data?.data || response.data
}

export const updateAdminCategoryRequest = async (
  id: string,
  payload: Partial<AdminCategoryPayload> | FormData
): Promise<AdminCategory> => {
  const isFormData = typeof FormData !== 'undefined' && payload instanceof FormData
  const response = await getAuthorizedAxios().put(API_ENDPOINTS.ADMIN.CATEGORY.UPDATE(id), payload, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined
  })
  return response.data?.data || response.data
}

export const deleteAdminCategoryRequest = async (id: string): Promise<AdminCategory> => {
  const response = await getAuthorizedAxios().delete(API_ENDPOINTS.ADMIN.CATEGORY.DELETE(id))
  return response.data?.data || response.data
}

export const bulkUpdateAdminCategoryStatusRequest = async (payload: {
  category_ids: string[]
  status: 'active' | 'inactive'
}) => {
  const response = await getAuthorizedAxios().put(API_ENDPOINTS.ADMIN.CATEGORY.BULK_STATUS, payload)
  return response.data
}

export const bulkDeleteAdminCategoriesRequest = async (payload: { category_ids: string[] }) => {
  const response = await getAuthorizedAxios().delete(API_ENDPOINTS.ADMIN.CATEGORY.BULK_DELETE, {
    data: payload
  })
  return response.data
}