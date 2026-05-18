import { useMutation, useQueryClient } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { submitProductReviewRequest } from '~/api/product.api'
import { productDetailKeys } from '~/queries/product/useProductDetailQuery'
import { reviewEligibilityKeys } from '~/queries/product/useReviewEligibilityQuery'
import type { SubmitReviewPayload } from '~/types/product.type'

export const useSubmitReviewMutation = (slug: Ref<string | null>) => {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: (payload: SubmitReviewPayload) => submitProductReviewRequest(slug.value as string, payload),
    onSuccess: async () => {
      toast.add({
        severity: 'success',
        summary: 'Cảm ơn bạn đã gửi đánh giá!',
        detail: 'Đánh giá của bạn giúp SmartFood cải thiện chất lượng mỗi ngày.',
        life: 3000
      })
      await queryClient.invalidateQueries({ queryKey: productDetailKeys.detail(slug.value) })
      await queryClient.invalidateQueries({ queryKey: reviewEligibilityKeys.detail(slug.value) })
    }
  })
}
