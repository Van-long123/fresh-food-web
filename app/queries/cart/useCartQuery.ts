import { useQuery } from '@tanstack/vue-query'
import { getCartRequest } from '~/api/cart.api'

export const cartKeys = {
  all: ['cart'] as const,
  details: () => [...cartKeys.all, 'detail'] as const,
}

export const useCartQuery = (enabled = true) => {
  return useQuery({
    queryKey: cartKeys.details(),
    queryFn: getCartRequest,
    enabled,
  })
}
