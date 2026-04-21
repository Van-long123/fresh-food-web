import { useQuery } from '@tanstack/vue-query'
import { getProvincesRequest } from '~/api/location.api'

export const useProvincesQuery = () => {
  return useQuery({
    queryKey: ['locations', 'provinces'],
    queryFn: getProvincesRequest,
    staleTime: 1000 * 60 * 60
  })
}
