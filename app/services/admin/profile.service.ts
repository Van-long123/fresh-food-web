import {
  changeAdminPasswordRequest,
  getAdminAuthMeRequest,
  updateAdminProfileRequest
} from '~/api/admin/profileApi'
import type { AdminProfilePayload, ChangePasswordPayload } from '~/types/user.type'

export const adminProfileService = {
  getMe: () => getAdminAuthMeRequest(),
  updateProfile: (payload: AdminProfilePayload | FormData) => updateAdminProfileRequest(payload),
  changePassword: (payload: ChangePasswordPayload) => changeAdminPasswordRequest(payload)
}