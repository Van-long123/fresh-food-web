import { computed, type Ref, unref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { adminCategoryService } from '~/services/admin/category.service'
import type { AdminCategoryQueryParams } from '~/types/category.type'

export const adminCategoryKeys = {
  all: ['admin-categories'] as const,
  list: (params?: AdminCategoryQueryParams) => ['admin-categories', 'list', params] as const,
  detail: (id: string) => ['admin-categories', 'detail', id] as const
}

export const useAdminCategoriesQuery = (params?: Ref<AdminCategoryQueryParams> | AdminCategoryQueryParams) => {
  return useQuery({
    queryKey: computed(() => adminCategoryKeys.list(unref(params))),
    queryFn: () => adminCategoryService.getList(unref(params)),
    staleTime: 60_000
  })
}