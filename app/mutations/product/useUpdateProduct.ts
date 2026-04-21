import { useMutation, useQueryClient } from '@tanstack/vue-query'
import type { Product } from '~/types/product.type'

export const useUpdateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (_payload: Product) => null,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['products'] })
    }
  })
}
