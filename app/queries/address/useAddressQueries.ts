import { useQuery } from '@tanstack/vue-query'
import {
  getAddressesRequest
} from '~/api/client/address.api'

export const addressKeys = {
  all: ['addresses'] as const,
  lists: () => [...addressKeys.all, 'list'] as const,
}

export const useAddressesQuery = () => {
  return useQuery({
    queryKey: addressKeys.lists(),
    queryFn: getAddressesRequest,
  })
}
