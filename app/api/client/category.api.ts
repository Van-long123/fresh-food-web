import { API_ENDPOINTS } from '~/constants/api'
import type {
  CategoryProductsApiResponse,
  CategoryProductsQueryParams
} from '~/types/category-products.type'
import { getAuthorizedAxios } from '~/utils/authorizedAxios'

export const getCategoryProductsRequest = async (
  slug: string,
  params: CategoryProductsQueryParams
): Promise<CategoryProductsApiResponse> => {
  const response = await getAuthorizedAxios().get(API_ENDPOINTS.CATEGORY.PRODUCTS(slug), { params })
  return response.data as CategoryProductsApiResponse
}
