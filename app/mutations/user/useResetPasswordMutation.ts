import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { userService } from '~/services/user.service'

export const useResetPasswordMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: userService.resetPassword,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })
}
