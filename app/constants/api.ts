export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/v1/client/users/register',
    VERIFY: '/v1/client/users/verify',
    LOGIN: '/v1/client/users/login',
    LOGOUT: '/v1/client/users/logout',
    REFRESH_TOKEN: '/v1/client/users/refresh_token',
    UPDATE_PROFILE: '/v1/client/users/update',
    FORGOT_PASSWORD: '/v1/client/users/forgot-password',
    RESET_PASSWORD: '/v1/client/users/reset-password',
    // ── Social OAuth ──────────────────────────────────────────
    GOOGLE_LOGIN: '/v1/client/users/google',
    FACEBOOK_LOGIN: '/v1/client/users/facebook',
    VERIFY_OAUTH: '/v1/client/users/verify-oauth'
  },
  HOME: {
    AGGREGATE: '/v1/client/home/aggregate',
    CAMPAIGN_PRODUCTS: (slug: string) => `/v1/client/home/campaigns/${slug}/products`,
    // CATEGORY_PRODUCTS: '/v1/client/home/category-products',
    // BLOGS: '/v1/client/home/blogs'
  },
  ARTICLE: {
    LIST: '/v1/client/articles',
    DETAIL: (slug: string) => `/v1/client/articles/${slug}`,
    CREATE_COMMENT: (slug: string) => `/v1/client/articles/${slug}/comments`
  },
  CATEGORY: {
    LIST: '/v1/client/categories',
    DETAIL: (slug: string) => `/v1/client/categories/${slug}`,
    PRODUCTS: (slug: string) => `/v1/client/categories/${slug}/products`
  },
  PRODUCT: {
    LIST: '/v1/client/products',
    DETAIL: (slug: string) => `/v1/client/products/${slug}/details`,
    CREATE_REVIEW: (slug: string) => `/v1/client/products/${slug}/reviews`
  },
  VOUCHER: {
    LIST: '/v1/client/vouchers',
    VALIDATE: '/v1/client/vouchers/validate'
  },
  CART: {
    GET: '/v1/client/cart',
    ADD_ITEM: '/v1/client/cart/items',
    UPDATE_ITEM: (productId: string) => `/v1/client/cart/items/${productId}`,
    REMOVE_ITEM: (productId: string) => `/v1/client/cart/items/${productId}`,
    REMOVE_ITEMS: '/v1/client/cart/items',
    MERGE: '/v1/client/cart/merge',
    VALIDATE: '/v1/client/cart/validate'
  }
} as const
