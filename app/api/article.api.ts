import { API_ENDPOINTS } from '~/constants/api'
import type { ArticleListQueryParams, ArticleListResponse, CategoryListQueryParams, CategoryListResponse } from '~/types/article.type'
import { getAuthorizedAxios } from '~/utils/authorizedAxios'

export const getArticleListRequest = async (
  params: ArticleListQueryParams
): Promise<ArticleListResponse> => {
  const response = await getAuthorizedAxios().get(API_ENDPOINTS.ARTICLE.LIST, { params })
  return response.data
}

export const getCategoryListRequest = async (
  params: CategoryListQueryParams
): Promise<CategoryListResponse> => {
  const response = await getAuthorizedAxios().get(API_ENDPOINTS.CATEGORY.LIST, { params })
  return response.data
}
