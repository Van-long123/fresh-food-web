import { computed, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { adminProductService } from '~/services/admin/product.service'
import { adminProductKeys } from './useAdminProductsQuery'

export const useAdminProductDetailQuery = (id: Ref<string | null>) => {
  const enabled = computed(() => Boolean(id.value))

  return useQuery({
    queryKey: computed(() => adminProductKeys.detail(id.value as string)),
    enabled,
    queryFn: () => adminProductService.getDetail(id.value as string),
    staleTime: 60_000
  })
}
