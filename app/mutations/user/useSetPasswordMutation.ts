import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { userService } from '~/services/user.service'

export const useSetPasswordMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: userService.setPassword,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })
}
