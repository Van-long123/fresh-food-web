import { API_ENDPOINTS } from '~/constants/api'
import type {
  ForgotPasswordPayload,
  LoginPayload,
  RegisterPayload,
  ResetPasswordPayload,
  SetPasswordPayload,
  UpdateProfilePayload,
  VerifyAccountPayload,
  VerifyOAuthPayload
} from '~/types/user.type'
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

export const updateProfileRequest = async (payload: UpdateProfilePayload | FormData) => {
  const response = await getAuthorizedAxios().put(API_ENDPOINTS.AUTH.UPDATE_PROFILE, payload, {
    headers: payload instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {}
  })
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

export const setPasswordRequest = async (payload: SetPasswordPayload) => {
  const response = await getAuthorizedAxios().post(API_ENDPOINTS.AUTH.SET_PASSWORD, payload)
  return response.data
}

/**
 * Gọi sau khi OAuth provider redirect về login-success
 * BE đã set Cookie, FE chỉ cần lấy thông tin user để cập nhật store */
export const verifyOAuthRequest = async (payload: VerifyOAuthPayload) => {
  const response = await getAuthorizedAxios().post(API_ENDPOINTS.AUTH.VERIFY_OAUTH, payload)
  return response.data
}
