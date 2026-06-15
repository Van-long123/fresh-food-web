import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { adminProductService } from '~/services/admin/product.service'
import { adminProductKeys } from '~/queries/product/useAdminProductsQuery'

export const useUpdateAdminProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: FormData }) =>
      adminProductService.update(id, payload),
    onSuccess: async (data) => {
      // Xóa toàn bộ cache list để tránh stale-while-revalidate hiển thị sai trang
      queryClient.removeQueries({ queryKey: adminProductKeys.all })
      if (data?._id) {
        queryClient.setQueryData(adminProductKeys.detail(data._id), data)
      }
    }
  })
}
