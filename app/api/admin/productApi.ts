import { API_ENDPOINTS } from '~/constants/api'
import { getAuthorizedAxios } from '~/utils/authorizedAxios'
import type {
  AdminProductQueryParams,
  AdminProductPayload,
  AdminProductListResponse,
  AdminCategoryListResponse,
  AdminProduct
} from '~/types/product.type'

export const getAdminProductsRequest = async (params?: AdminProductQueryParams): Promise<AdminProductListResponse> => {
  const response = await getAuthorizedAxios().get(API_ENDPOINTS.ADMIN.PRODUCT.LIST, { params })
  return response.data
}

export const getAdminProductDetailRequest = async (id: string): Promise<AdminProduct> => {
  const response = await getAuthorizedAxios().get(API_ENDPOINTS.ADMIN.PRODUCT.DETAIL(id))
  return response.data?.data || response.data
}

export const createAdminProductRequest = async (payload: AdminProductPayload | FormData): Promise<AdminProduct> => {
  const isFormData = typeof FormData !== 'undefined' && payload instanceof FormData
  const response = await getAuthorizedAxios().post(API_ENDPOINTS.ADMIN.PRODUCT.CREATE, payload, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined
  })
  return response.data?.data || response.data
}

export const updateAdminProductRequest = async (id: string, payload: Partial<AdminProductPayload> | FormData): Promise<AdminProduct> => {
  const isFormData = typeof FormData !== 'undefined' && payload instanceof FormData
  const response = await getAuthorizedAxios().put(API_ENDPOINTS.ADMIN.PRODUCT.UPDATE(id), payload, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined
  })
  return response.data?.data || response.data
}

export const deleteAdminProductRequest = async (id: string): Promise<AdminProduct> => {
  const response = await getAuthorizedAxios().delete(API_ENDPOINTS.ADMIN.PRODUCT.DELETE(id))
  return response.data?.data || response.data
}

export const updateAdminProductBulkStatusRequest = async (payload: { product_ids: string[]; status: 'active' | 'inactive' }): Promise<{ updatedCount: number }> => {
  const response = await getAuthorizedAxios().put(API_ENDPOINTS.ADMIN.PRODUCT.BULK_STATUS, payload)
  return response.data
}

export const deleteAdminProductsBulkRequest = async (payload: { product_ids: string[] }): Promise<{ deletedCount: number }> => {
  const response = await getAuthorizedAxios().delete(API_ENDPOINTS.ADMIN.PRODUCT.BULK_DELETE, { data: payload })
  return response.data
}

export const getAdminCategoriesRequest = async (params?: any): Promise<AdminCategoryListResponse> => {
  const response = await getAuthorizedAxios().get(API_ENDPOINTS.ADMIN.CATEGORY.LIST, {
    params: { limit: 1000, ...params }
  })
  return response.data
}
