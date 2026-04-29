import { API_ENDPOINTS } from '~/constants/api'
import type {
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  UpdateProfilePayload,
  VerifyAccountPayload
} from '~/constants/auth'
import { getAuthorizedAxios } from '~/utils/authorizedAxios'

export const registerRequest = async (payload: RegisterPayload) => {
  const response = await getAuthorizedAxios().post(API_ENDPOINTS.AUTH.REGISTER, payload)
  return response.data
}

export const verifyAccountRequest = async (payload: VerifyAccountPayload) => {
  const response = await getAuthorizedAxios().put(API_ENDPOINTS.AUTH.VERIFY, payload)
  return response.data
}

export const loginRequest = async (payload: LoginPayload) => {
  const response = await getAuthorizedAxios().post(API_ENDPOINTS.AUTH.LOGIN, payload)
  return response.data
}


export const logoutRequest = async () => {
  const response = await getAuthorizedAxios().delete(API_ENDPOINTS.AUTH.LOGOUT)
  return response.data
}

export const refreshTokenRequest = async () => {
  const response = await getAuthorizedAxios().get(API_ENDPOINTS.AUTH.REFRESH_TOKEN)
  return response.data
}

export const updateProfileRequest = async (payload: UpdateProfilePayload) => {
  const response = await getAuthorizedAxios().put(API_ENDPOINTS.AUTH.UPDATE_PROFILE, payload)
  return response.data
}

export const forgotPasswordRequest = async (payload: ForgotPasswordPayload) => {
  const response = await getAuthorizedAxios().post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, payload)
  return response.data
}

export const resetPasswordRequest = async (payload: ResetPasswordPayload) => {
  const response = await getAuthorizedAxios().put(API_ENDPOINTS.AUTH.RESET_PASSWORD, payload)
  return response.data
}
