export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/v1/users/register',
    VERIFY: '/v1/users/verify',
    LOGIN: '/v1/users/login',
    LOGOUT: '/v1/users/logout',
    REFRESH_TOKEN: '/v1/users/refresh_token',
    UPDATE_PROFILE: '/v1/users/update',
    FORGOT_PASSWORD: '/v1/users/forgot-password',
    RESET_PASSWORD: '/v1/users/reset-password'
  }
} as const
