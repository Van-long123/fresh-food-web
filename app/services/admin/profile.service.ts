import { changeAdminPasswordRequest, updateAdminProfileRequest } from '~/api/admin/profileApi'
import type { AdminProfilePayload, ChangePasswordPayload } from '~/types/user.type'

export const adminProfileService = {
  updateProfile: (payload: AdminProfilePayload | FormData) => updateAdminProfileRequest(payload),
  changePassword: (payload: ChangePasswordPayload) => changeAdminPasswordRequest(payload)
}