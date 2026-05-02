import {
  forgotPasswordRequest,
  loginRequest,
  logoutRequest,
  refreshTokenRequest,
  registerRequest,
  resetPasswordRequest,
  updateProfileRequest,
  verifyAccountRequest,
  verifyOAuthRequest
} from '~/api/user.api'
import type {
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  UpdateProfilePayload,
  VerifyAccountPayload,
  VerifyOAuthPayload
} from '~/types/user.type'

export const userService = {
  register: (payload: RegisterPayload) => registerRequest(payload),
  verifyAccount: (payload: VerifyAccountPayload) => verifyAccountRequest(payload),
  login: (payload: LoginPayload) => loginRequest(payload),
  logout: () => logoutRequest(),
  refreshToken: () => refreshTokenRequest(),
  updateProfile: (payload: UpdateProfilePayload | FormData) => updateProfileRequest(payload),
  forgotPassword: (payload: ForgotPasswordPayload) => forgotPasswordRequest(payload),
  resetPassword: (payload: ResetPasswordPayload) => resetPasswordRequest(payload),
  verifyOAuth: (payload: VerifyOAuthPayload) => verifyOAuthRequest(payload)
}
