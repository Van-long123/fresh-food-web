import { computed, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { getProductDetailRequest } from '~/api/product.api'

export const useProductDetailQuery = (slug: Ref<string | null>) => {
  const enabled = computed(() => Boolean(slug.value))

  return useQuery({
    queryKey: computed(() => ['products', slug.value]),
    enabled,
    queryFn: () => getProductDetailRequest(slug.value as string)
  })
}
