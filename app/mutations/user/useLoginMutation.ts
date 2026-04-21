import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { userService } from '~/services/user.service'

export const useLoginMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: userService.login,
    retry: false,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })
}
