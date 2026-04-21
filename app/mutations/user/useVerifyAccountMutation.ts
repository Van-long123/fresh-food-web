import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { userService } from '~/services/user.service'

export const useVerifyAccountMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: userService.verifyAccount,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })
}
