import { API_ENDPOINTS } from '~/constants/api'
import type {
  Product,
  ProductDetailResponse,
  ProductQueryParams,
  ProductListResponse,
  ProductRecommendationResponse
} from '~/types/product.type'
import { getAuthorizedAxios } from '~/utils/authorizedAxios'

export const getProductsRequest = async (params?: ProductQueryParams): Promise<any> => {
  const response = await getAuthorizedAxios().get(API_ENDPOINTS.PRODUCT.LIST, { params })
  return response.data
}

export const getProductDetailRequest = async (slug: string): Promise<ProductDetailResponse | null> => {
  const response = await getAuthorizedAxios().get(API_ENDPOINTS.PRODUCT.DETAIL(slug))
  return (response.data || null) as ProductDetailResponse | null
}

export const getProductRecommendationsRequest = async (
  id: string,
  params?: { limit?: number; category_boost?: boolean }
): Promise<ProductRecommendationResponse> => {
  const response = await getAuthorizedAxios().get(API_ENDPOINTS.PRODUCT.RECOMMENDATIONS(id), { params })
  return response.data as ProductRecommendationResponse
}
