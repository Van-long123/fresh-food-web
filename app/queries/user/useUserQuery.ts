import { computed, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'

export const useUserQuery = (userId: Ref<string | null>) => {
  const enabled = computed(() => Boolean(userId.value))

  return useQuery({
    queryKey: computed(() => ['users', userId.value]),
    enabled,
    queryFn: async () => null
  })
}
