import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { adminProductService } from '~/services/admin/product.service'
import { adminProductKeys } from '~/queries/product/useAdminProductsQuery'

export const useUpdateAdminProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: FormData }) =>
      adminProductService.update(id, payload),
    onSuccess: async (data) => {
      // Invalidate cả list lẫn detail cụ thể
      await queryClient.invalidateQueries({ 
        queryKey: adminProductKeys.all,
        refetchType: 'all' 
      })
      if (data?._id) {
        queryClient.setQueryData(adminProductKeys.detail(data._id), data)
      }
    }
  })
}
