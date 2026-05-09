import { useQuery } from '@tanstack/vue-query'
import { getWardsRequest } from '~/api/location.api'
import type { Ref } from 'vue'

export const useWardsQuery = (districtIdValue: Ref<number | null>) => {
  return useQuery({
    queryKey: ['wards', districtIdValue],
    queryFn: () => getWardsRequest(districtIdValue.value as number),
    enabled: () => !!districtIdValue.value,
    staleTime: Infinity
  })
}
