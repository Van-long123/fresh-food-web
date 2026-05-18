import { computed, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { getProductDetailRequest } from '~/api/product.api'

export const productDetailKeys = {
  all: ['product-detail'] as const,
  detail: (slug: string | null) => ['product-detail', slug] as const
}

export const useProductDetailQuery = (slug: Ref<string | null>) => {
  const enabled = computed(() => Boolean(slug.value))

  return useQuery({
    queryKey: computed(() => productDetailKeys.detail(slug.value)),
    enabled,
    queryFn: () => getProductDetailRequest(slug.value as string)
  })
}
