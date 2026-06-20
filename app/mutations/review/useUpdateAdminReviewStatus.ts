import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { adminReviewService } from '~/services/admin/review.service'
import { adminReviewKeys } from '~/queries/review/useAdminReviewsQuery'
import type { AdminReviewStatusPayload } from '~/types/review.type'

export const useUpdateAdminReviewStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AdminReviewStatusPayload }) =>
      adminReviewService.updateStatus(id, payload),
    onSuccess: async (data) => {
      queryClient.removeQueries({ queryKey: ['admin-reviews', 'list'] })
      if (data?.id) {
        queryClient.setQueryData(adminReviewKeys.detail(data.id), data)
      }
    }
  })
}
