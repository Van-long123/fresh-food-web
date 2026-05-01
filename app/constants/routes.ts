export const ROUTES = {
  HOME: '/',

  // ── Authentication ──────────────────────────────────────────
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    CHANGE_PASSWORD: '/auth/change-password',
  },

  // ── Main navigation ─────────────────────────────────────────
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

  // ── Company ──────────────────────────────────────────────────
  STORES: '/stores',
  RECRUITMENT: '/recruitment',
  ONELIFE_APP: '/onelife-app',
  ONELIFE_CARD: '/onelife-card',

  // ── User account ─────────────────────────────────────────────
  PROFILE: '/profile',
  ORDERS: '/orders',
  VOUCHERS: '/vouchers',
  SEARCH: '/search',

  // ── Catalog ──────────────────────────────────────────────────
  CATEGORY: (slug: string) => `/category/${slug}`,
  CAMPAIGN: (slug: string) => `/campaign/${slug}`,
  PRODUCT_DETAIL: (slug: string) => `/product/${slug}`,

  // ── Cart ─────────────────────────────────────────────────────
  CART: '/cart',

  // ── Order ────────────────────────────────────────────────────
  ORDER: {
    CART_INFO: '/order/cart-info',
    CHECKOUT: '/order/checkout',
    INFO: '/order/info',
  },

  // ── Admin ───────────────────────────────────────────────────
  ADMIN: {
    DASHBOARD: '/admin',
    PRODUCTS: '/admin/products',
    CATEGORIES: '/admin/categories',
    USERS: '/admin/users',
    SETTINGS: '/admin/settings',
    PRICING: '/admin/pricing',
    MAINTENANCE: '/admin/maintenance',
  },

  // ── Others ───────────────────────────────────────────────────
  ERROR_404: '/404',
} as const

