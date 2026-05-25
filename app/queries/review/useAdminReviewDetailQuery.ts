import { computed, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { adminReviewService } from '~/services/admin/review.service'
import { adminReviewKeys } from './useAdminReviewsQuery'

export const useAdminReviewDetailQuery = (id: Ref<string | null>) => {
  const enabled = computed(() => Boolean(id.value))

  return useQuery({
    queryKey: computed(() => adminReviewKeys.detail(id.value as string)),
    enabled,
    queryFn: () => adminReviewService.getDetail(id.value as string),
    staleTime: 60_000
  })
}
