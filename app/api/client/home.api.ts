import { API_ENDPOINTS } from '~/constants/api'
import type {
  HomeAggregateApiResponse,
  HomeAggregateQueryParams,
  // HomeBlogsApiResponse,
  // HomeBlogsQueryParams,
  // HomeCategoryProductsApiResponse,
  // HomeSectionProductsQueryParams
} from '~/types/home.type'
import { getAuthorizedAxios } from '~/utils/authorizedAxios'

export const getHomeAggregateRequest = async (
  params: HomeAggregateQueryParams
): Promise<HomeAggregateApiResponse> => {
  const response = await getAuthorizedAxios().get(API_ENDPOINTS.HOME.AGGREGATE, { params })
  return response.data
}

// export const getHomeCategoryProductsRequest = async (
// params: HomeSectionProductsQueryParams
// ): Promise<HomeCategoryProductsApiResponse> => {
// const response = await getAuthorizedAxios().get(API_ENDPOINTS.HOME.CATEGORY_PRODUCTS, { params })
// return response.data
// }

// export const getHomeBlogsRequest = async (
// params: HomeBlogsQueryParams
// ): Promise<HomeBlogsApiResponse> => {
// const response = await getAuthorizedAxios().get(API_ENDPOINTS.HOME.BLOGS, { params })
// return response.data
// }

export const getCampaignProductsRequest = async (
  slug: string,
  params: any
): Promise<any> => {
  const response = await getAuthorizedAxios().get(API_ENDPOINTS.HOME.CAMPAIGN_PRODUCTS(slug), { params })
  return response.data
}
