import { useQuery } from '@tanstack/vue-query'
import { getDistrictsRequest } from '~/api/client/location.api'
import type { Ref } from 'vue'

export const useDistrictsQuery = (provinceIdValue: Ref<number | null>) => {
  return useQuery({
    queryKey: ['districts', provinceIdValue],
    queryFn: () => getDistrictsRequest(provinceIdValue.value as number),
    enabled: () => !!provinceIdValue.value,
    staleTime: Infinity
  })
}
