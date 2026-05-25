import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { adminCategoryService } from '~/services/admin/category.service'
import { adminCategoryKeys } from '~/queries/category/useAdminCategoriesQuery'

export const useDeleteAdminCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => adminCategoryService.delete(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: adminCategoryKeys.all,
        refetchType: 'all'
      })
    }
  })
}