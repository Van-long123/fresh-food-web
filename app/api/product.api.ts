import { API_ENDPOINTS } from '~/constants/api'
import type { Product, ProductDetailResponse, ProductQueryParams, ProductListResponse } from '~/types/product.type'
import { getAuthorizedAxios } from '~/utils/authorizedAxios'

export const getProductsRequest = async (params?: ProductQueryParams): Promise<any> => {
  const response = await getAuthorizedAxios().get(API_ENDPOINTS.PRODUCT.LIST, { params })
  return response.data
}

export const getProductDetailRequest = async (slug: string): Promise<ProductDetailResponse | null> => {
  const response = await getAuthorizedAxios().get(API_ENDPOINTS.PRODUCT.DETAIL(slug))
  return (response.data || null) as ProductDetailResponse | null
}
