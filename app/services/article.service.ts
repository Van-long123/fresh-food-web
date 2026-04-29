import { createArticleCommentRequest, getArticleDetailRequest, getArticleListRequest, getCategoryListRequest } from '~/api/article.api'
import type { CreateArticleCommentPayload, ArticleListQueryParams, CategoryListQueryParams } from '~/types/article.type'

export const articleService = {
  getList: (params: ArticleListQueryParams) => getArticleListRequest(params),
  getCategories: (params: CategoryListQueryParams) => getCategoryListRequest(params),
  getDetail: (slug: string) => getArticleDetailRequest(slug),
  createComment: (slug: string, payload: CreateArticleCommentPayload) => createArticleCommentRequest(slug, payload)
}
