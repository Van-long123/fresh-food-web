export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/v1/client/users/register',
    VERIFY: '/v1/client/users/verify',
    LOGIN: '/v1/client/users/login',
    LOGOUT: '/v1/client/users/logout',
    REFRESH_TOKEN: '/v1/client/users/refresh_token',
    UPDATE_PROFILE: '/v1/client/users/update',
    FORGOT_PASSWORD: '/v1/client/users/forgot-password',
    RESET_PASSWORD: '/v1/client/users/reset-password'
  },
  HOME: {
    AGGREGATE: '/v1/client/home/aggregate',
    // CATEGORY_PRODUCTS: '/v1/client/home/category-products',
    // BLOGS: '/v1/client/home/blogs'
  }
} as const
