import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { adminProductService } from '~/services/admin/product.service'

export const useBulkDeleteAdminProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: { product_ids: string[] }) =>
      adminProductService.bulkDelete(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
    }
  })
}
