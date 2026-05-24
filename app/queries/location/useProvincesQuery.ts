import { useQuery } from '@tanstack/vue-query'
import { getProvincesRequest } from '~/api/client/location.api'

export const useProvincesQuery = () => {
  return useQuery({
    queryKey: ['provinces'],
    queryFn: getProvincesRequest,
    staleTime: Infinity
  })
}
