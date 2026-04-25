import { getArticleListRequest, getCategoryListRequest } from '~/api/article.api'
import type { ArticleListQueryParams, CategoryListQueryParams } from '~/types/article.type'

export const articleService = {
  getList: (params: ArticleListQueryParams) => getArticleListRequest(params),
  getCategories: (params: CategoryListQueryParams) => getCategoryListRequest(params)
}
