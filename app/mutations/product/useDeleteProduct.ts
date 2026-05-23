import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { adminProductService } from '~/services/admin/product.service'
import { adminProductKeys } from '~/queries/product/useAdminProductsQuery'

export const useDeleteAdminProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => adminProductService.delete(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ 
        queryKey: adminProductKeys.all,
        refetchType: 'all'
      })
    }
  })
}
