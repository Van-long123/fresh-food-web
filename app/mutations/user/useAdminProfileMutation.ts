import { useMutation } from '@tanstack/vue-query'
import { adminProfileService } from '~/services/admin/profile.service'

export const useAdminProfileMutation = () => {
  return useMutation({
    mutationFn: adminProfileService.updateProfile
  })
}