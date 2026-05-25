import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { adminCategoryService } from '~/services/admin/category.service'
import { adminCategoryKeys } from '~/queries/category/useAdminCategoriesQuery'

export const useBulkUpdateAdminCategoryStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: { category_ids: string[]; status: 'active' | 'inactive' }) =>
      adminCategoryService.bulkUpdateStatus(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: adminCategoryKeys.all,
        refetchType: 'all'
      })
    }
  })
}