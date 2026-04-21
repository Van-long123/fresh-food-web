import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { userService } from '~/services/user.service'

export const useForgotPasswordMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: userService.forgotPassword,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })
}
