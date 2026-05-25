import { computed, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { adminCategoryService } from '~/services/admin/category.service'
import { adminCategoryKeys } from './useAdminCategoriesQuery'

export const useAdminCategoryDetailQuery = (id: Ref<string | null>) => {
  const enabled = computed(() => Boolean(id.value))

  return useQuery({
    queryKey: computed(() => adminCategoryKeys.detail(id.value as string)),
    enabled,
    queryFn: () => adminCategoryService.getDetail(id.value as string),
    staleTime: 60_000
  })
}