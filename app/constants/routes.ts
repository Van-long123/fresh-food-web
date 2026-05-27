export const ROUTES = {
  HOME: '/',

  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    CHANGE_PASSWORD: '/auth/change-password',
    LOGIN_SUCCESS: '/auth/login-success',
  },

  // Main navigation
  SUPPORT: '/support',
  NEWS: '/news',
  NEWS_DETAIL: (slug?: string) => `/news/${slug || ''}`,
  ABOUT: '/about',
  VISION_MISSION: '/vision-mission',
  TERMS_OF_SERVICE: '/terms-of-service',
  PRIVACY_POLICY: '/privacy-policy',
  LEGAL: '/legal',
  RETURNS: '/returns',
  COMPLAINTS: '/complaints',
  SHOPPING_GUIDE: '/shopping-guide',
  REGISTRATION_GUIDE: '/registration-guide',

  // Company
  STORES: '/stores',
  RECRUITMENT: '/recruitment',
  ONELIFE_APP: '/onelife-app',
  ONELIFE_CARD: '/onelife-card',

  // User account
  PROFILE: '/profile',
  ORDERS: '/orders',
  VOUCHERS: '/vouchers',
  SEARCH: '/search',

  // Catalog
  CATEGORY: (slug: string) => `/category/${slug}`,
  CAMPAIGN: (slug: string) => `/campaign/${slug}`,
  PRODUCT_DETAIL: (slug: string) => `/product/${slug}`,

  // Cart
  CART: '/cart',

  // Order
  ORDER: {
    CART_INFO: '/order/cart-info',
    CHECKOUT: '/order/checkout',
    INFO: '/order/info',
  },

  // Admin
  ADMIN: {
    DASHBOARD: '/admin',
    PROFILE: '/admin/profile',
    PRODUCTS: '/admin/products',
    PRODUCT_CREATE: '/admin/products/create',
    PRODUCT_EDIT: (id: string | number) => `/admin/products/${id}/edit`,
    CATEGORIES: '/admin/categories',
    CATEGORY_CREATE: '/admin/categories/create',
    CATEGORY_EDIT: (id: string | number) => `/admin/categories/${id}/edit`,
    ORDERS: '/admin/orders',
    ORDER_DETAIL: (id: string | number) => `/admin/orders/${id}`,
    USERS: '/admin/users',
    USER_CREATE: '/admin/users/create',
    USER_EDIT: (id: string | number) => `/admin/users/${id}/edit`,
    VOUCHERS: '/admin/vouchers',
    VOUCHER_CREATE: '/admin/vouchers/create',
    VOUCHER_EDIT: (id: string | number) => `/admin/vouchers/${id}/edit`,
    REVIEWS: '/admin/reviews',
    REVIEW_DETAIL: (id: string | number) => `/admin/reviews/${id}`,
    REFUND_REQUESTS: '/admin/refund-requests',
    REFUND_REQUEST_DETAIL: (id: string | number) => `/admin/refund-requests/${id}`,
    ARTICLES: '/admin/articles',
    ARTICLE_CREATE: '/admin/articles/create',
    ARTICLE_EDIT: (id: string | number) => `/admin/articles/${id}/edit`,
    ROLES: '/admin/roles',
    ROLE_CREATE: '/admin/roles/create',
    ROLE_EDIT: (id: string | number) => `/admin/roles/${id}/edit`,
    PAYMENTS: '/admin/payments',
    SETTINGS: '/admin/settings',
    PRICING: '/admin/pricing',
    MAINTENANCE: '/admin/maintenance',
  },

  // Others
  ERROR_404: '/404',
} as const

