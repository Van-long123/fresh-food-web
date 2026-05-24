import { computed, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { checkReviewEligibilityRequest } from '~/api/client/product.api'

export const reviewEligibilityKeys = {
  all: ['review-eligibility'] as const,
  detail: (slug: string | null) => ['review-eligibility', slug] as const
}

export const useReviewEligibilityQuery = (slug: Ref<string | null>, enabledOverride?: Ref<boolean>) => {
  const enabled = computed(() => Boolean(slug.value) && (enabledOverride ? enabledOverride.value : true))

  return useQuery({
    queryKey: computed(() => reviewEligibilityKeys.detail(slug.value)),
    enabled,
    queryFn: () => checkReviewEligibilityRequest(slug.value as string)
  })
}
