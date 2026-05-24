import { useMutation } from '@tanstack/vue-query'
import { adminProfileService } from '~/services/admin/profile.service'

export const useAdminChangePasswordMutation = () => {
  return useMutation({
    mutationFn: adminProfileService.changePassword
  })
}