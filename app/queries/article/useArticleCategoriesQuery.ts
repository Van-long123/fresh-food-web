import { useQuery } from '@tanstack/vue-query'
import { articleService } from '~/services/article.service'
import type { CategoryListQueryParams } from '~/types/article.type'

export const useArticleCategoriesQuery = (params: CategoryListQueryParams = { type: 'article' }) => {
  return useQuery({
    queryKey: ['categories', 'article', params],
    queryFn: () => articleService.getCategories(params)
  })
}
