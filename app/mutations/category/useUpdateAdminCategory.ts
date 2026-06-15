import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { adminCategoryService } from '~/services/admin/category.service'
import { adminCategoryKeys } from '~/queries/category/useAdminCategoriesQuery'

export const useUpdateAdminCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: FormData }) =>
      adminCategoryService.update(id, payload),
    onSuccess: async (data) => {
      queryClient.removeQueries({ queryKey: adminCategoryKeys.all })

      if (data?._id) {
        queryClient.setQueryData(adminCategoryKeys.detail(data._id), data)
      }
    }
  })
}