import { useQuery } from '@tanstack/vue-query'

export const useUsersQuery = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => []
  })
}
