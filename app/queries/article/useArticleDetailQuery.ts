import { computed, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { articleService } from '~/services/article.service'

export const useArticleDetailQuery = (slug: Ref<string>) => {
  const enabled = computed(() => Boolean(slug.value))

  return useQuery({
    queryKey: computed(() => ['articles', 'detail', slug.value]),
    enabled,
    queryFn: () => articleService.getDetail(slug.value)
  })
}
