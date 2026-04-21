import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { userService } from '~/services/user.service'

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: userService.updateProfile,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })
}
