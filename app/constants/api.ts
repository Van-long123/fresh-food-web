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
    SET_PASSWORD: '/v1/client/users/set-password',
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
    CREATE_REVIEW: (slug: string) => `/v1/client/products/${slug}/reviews`,
    REVIEW_ELIGIBILITY: (slug: string) => `/v1/client/products/${slug}/review-eligibility`,
    RECOMMENDATIONS: (id: string) => `/v1/client/products/${id}/recommendations`
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
  },
  LOCATION: {
    PROVINCES: '/v1/client/ghn/provinces',
    DISTRICTS: '/v1/client/ghn/districts',
    WARDS: '/v1/client/ghn/wards'
  },
  ADDRESS: {
    LIST: '/v1/client/addresses',
    CREATE: '/v1/client/addresses',
    UPDATE: (id: string) => `/v1/client/addresses/${id}`,
    DELETE: (id: string) => `/v1/client/addresses/${id}`
  },
  CHECKOUT: {
    SHIPPING_FEE: '/v1/client/checkout/shipping-fee',
    COD: '/v1/client/checkout/cod',
    PAYOS: '/v1/client/checkout/payos'
  },
  ORDER: {
    VALIDATE_STOCK: '/v1/client/orders/validate-stock',
    CREATE: '/v1/client/orders',
    MY_ORDERS: '/v1/client/orders/my-orders',
    DETAIL: (id: string) => `/v1/client/orders/${id}`,
    CANCEL: (id: string) => `/v1/client/orders/${id}/cancel`,
    RECEIVED: (id: string) => `/v1/client/orders/${id}/received`
  },
  REFUND: {
    UPLOAD: '/v1/client/refund-requests/upload',
    CREATE: '/v1/client/refund-requests',
    BY_ORDER: (orderId: string) => `/v1/client/refund-requests/order/${orderId}`,
    BANK_INFO: (id: string) => `/v1/client/refund-requests/${id}/bank-info`
  },
  SETTINGS: {
    GET: '/v1/client/settings'
  },
  // ── Admin ────────────────────────────────────────────────────
  ADMIN: {
    PRODUCT: {
      LIST: '/v1/admin/products',
      DETAIL: (id: string) => `/v1/admin/products/${id}`,
      CREATE: '/v1/admin/products',
      UPDATE: (id: string) => `/v1/admin/products/${id}`,
      DELETE: (id: string) => `/v1/admin/products/${id}`,
      BULK_STATUS: '/v1/admin/products/bulk-status',
      BULK_DELETE: '/v1/admin/products/bulk'
    },
    CATEGORY: {
      LIST: '/v1/admin/categories',
      DETAIL: (id: string) => `/v1/admin/categories/${id}`,
      CREATE: '/v1/admin/categories',
      UPDATE: (id: string) => `/v1/admin/categories/${id}`,
      DELETE: (id: string) => `/v1/admin/categories/${id}`,
      BULK_STATUS: '/v1/admin/categories/bulk-status',
      BULK_DELETE: '/v1/admin/categories/bulk'
    },
    ROLE: {
      LIST: '/v1/admin/roles',
      DETAIL: (id: string) => `/v1/admin/roles/${id}`,
      CREATE: '/v1/admin/roles',
      UPDATE: (id: string) => `/v1/admin/roles/${id}`,
      DELETE: (id: string) => `/v1/admin/roles/${id}`,
      DELETE_MANY: '/v1/admin/roles'
    },
    SETTINGS: {
      GET: '/v1/admin/settings',
      UPDATE: '/v1/admin/settings'
    },
    PROFILE: {
      UPDATE: '/v1/admin/profile',
      CHANGE_PASSWORD: '/v1/admin/profile/password'
    },
    USER: {
      LIST: '/v1/admin/users',
      DETAIL: (id: string) => `/v1/admin/users/${id}`,
      CREATE: '/v1/admin/users',
      UPDATE: (id: string) => `/v1/admin/users/${id}`,
      DELETE: (id: string) => `/v1/admin/users/${id}`,
      BULK_STATUS: '/v1/admin/users/bulk-status',
      BULK_DELETE: '/v1/admin/users/bulk'
    },
    REVIEW: {
      LIST: '/v1/admin/reviews',
      DETAIL: (id: string) => `/v1/admin/reviews/${id}`,
      UPDATE_STATUS: (id: string) => `/v1/admin/reviews/${id}/status`
    }
  }
} as const
