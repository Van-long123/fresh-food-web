import {
  forgotPasswordRequest,
  loginRequest,
  logoutRequest,
  refreshTokenRequest,
  registerRequest,
  resetPasswordRequest,
  updateProfileRequest,
  verifyAccountRequest
} from '~/api/user.api'
import type {
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  UpdateProfilePayload,
  VerifyAccountPayload
} from '~/constants/auth'

export const userService = {
  register: (payload: RegisterPayload) => registerRequest(payload),
  verifyAccount: (payload: VerifyAccountPayload) => verifyAccountRequest(payload),
  login: (payload: LoginPayload) => loginRequest(payload),
  logout: () => logoutRequest(),
  refreshToken: () => refreshTokenRequest(),
  updateProfile: (payload: UpdateProfilePayload) => updateProfileRequest(payload),
  forgotPassword: (payload: ForgotPasswordPayload) => forgotPasswordRequest(payload),
  resetPassword: (payload: ResetPasswordPayload) => resetPasswordRequest(payload)
}
