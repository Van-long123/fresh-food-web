import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { adminCategoryService } from '~/services/admin/category.service'
import { adminCategoryKeys } from '~/queries/category/useAdminCategoriesQuery'

export const useCreateAdminCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: FormData) => adminCategoryService.create(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: adminCategoryKeys.all,
        refetchType: 'all'
      })
    }
  })
}