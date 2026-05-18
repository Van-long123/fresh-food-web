import { API_ENDPOINTS } from '~/constants/api'
import type {
  Product,
  ProductDetailResponse,
  ProductQueryParams,
  ProductListResponse,
  ProductRecommendationResponse,
  ReviewEligibilityResponse,
  SubmitReviewPayload
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

export const checkReviewEligibilityRequest = async (slug: string): Promise<ReviewEligibilityResponse> => {
  const response = await getAuthorizedAxios().get(API_ENDPOINTS.PRODUCT.REVIEW_ELIGIBILITY(slug))
  return response.data as ReviewEligibilityResponse
}

export const submitProductReviewRequest = async (slug: string, payload: SubmitReviewPayload): Promise<any> => {
  const response = await getAuthorizedAxios().post(API_ENDPOINTS.PRODUCT.CREATE_REVIEW(slug), payload)
  return response.data
}
