import { API_ENDPOINTS } from '~/constants/api'
import type {
  CreateArticleCommentPayload,
  CreateArticleCommentResponse,
  ArticleDetailResponse,
  ArticleListQueryParams,
  ArticleListResponse,
  CategoryListQueryParams,
  CategoryListResponse
} from '~/types/article.type'
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

export const getArticleDetailRequest = async (slug: string): Promise<ArticleDetailResponse> => {
  const response = await getAuthorizedAxios().get(API_ENDPOINTS.ARTICLE.DETAIL(slug))
  return response.data
}

export const createArticleCommentRequest = async (
  slug: string,
  payload: CreateArticleCommentPayload
): Promise<CreateArticleCommentResponse> => {
  const response = await getAuthorizedAxios().post(API_ENDPOINTS.ARTICLE.CREATE_COMMENT(slug), payload)
  return response.data
}
