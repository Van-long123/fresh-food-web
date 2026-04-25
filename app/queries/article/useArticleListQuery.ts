import { useQuery } from '@tanstack/vue-query'
import { articleService } from '~/services/article.service'
import type { ArticleListQueryParams } from '~/types/article.type'

export const useArticleListQuery = (params: () => ArticleListQueryParams) => {
  return useQuery({
    queryKey: ['articles', 'list', params],
    queryFn: () => articleService.getList(params())
  })
}
