import { useQuery } from '@tanstack/vue-query'
import { getProductsRequest } from '~/api/product.api'

export const useProductsQuery = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: getProductsRequest
  })
}
