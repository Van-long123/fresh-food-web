import { computed, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { getProductDetailRequest } from '~/api/product.api'

export const useProductDetailQuery = (productId: Ref<string | number | null>) => {
  const enabled = computed(() => Boolean(productId.value))

  return useQuery({
    queryKey: computed(() => ['products', productId.value]),
    enabled,
    queryFn: () => getProductDetailRequest(productId.value as string | number)
  })
}
