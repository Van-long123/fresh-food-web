import { computed, unref, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { adminReviewService } from '~/services/admin/review.service'
import type { AdminReviewQueryParams } from '~/types/review.type'

export const adminReviewKeys = {
  all: ['admin-reviews'] as const,
  list: (params?: AdminReviewQueryParams) => ['admin-reviews', 'list', params] as const,
  detail: (id: string) => ['admin-reviews', 'detail', id] as const
}

export const useAdminReviewsQuery = (params?: Ref<AdminReviewQueryParams> | AdminReviewQueryParams) => {
  return useQuery({
    queryKey: computed(() => adminReviewKeys.list(unref(params))),
    queryFn: () => adminReviewService.getList(unref(params))
  })
}
