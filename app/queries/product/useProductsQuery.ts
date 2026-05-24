import { useQuery } from '@tanstack/vue-query'
import type { MaybeRef } from 'vue'
import { unref } from 'vue'
import { getProductsRequest } from '~/api/client/product.api'
import type { ProductQueryParams, ProductListResponse } from '~/types/product.type'

export const useProductsQuery = (params?: MaybeRef<ProductQueryParams>) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => getProductsRequest(unref(params))
  })
}
// unref(x)
// Nếu x là ref → trả về x.value
// Nếu x là computed → trả về x.value
// Nếu x là value thường → trả nguyên giá trị