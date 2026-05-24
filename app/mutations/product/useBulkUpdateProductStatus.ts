import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { adminProductService } from '~/services/admin/product.service'

export const useBulkUpdateAdminProductStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: { product_ids: string[]; status: 'active' | 'inactive' }) =>
      adminProductService.bulkUpdateStatus(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
    }
  })
}
