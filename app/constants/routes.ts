/**
 * @file constants/routes.ts
 * @description Centralized route definitions for SmartFood.
 * Import ROUTES in any component instead of hardcoding URLs.
 *
 * Usage:
 *   import { ROUTES } from '~/constants/routes'
 *   <NuxtLink :to="ROUTES.AUTH.LOGIN">Đăng nhập</NuxtLink>
 */

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
  PRODUCT_DETAIL: (slug: string) => `/product/${slug}`,

  // ── Cart ─────────────────────────────────────────────────────
  CART: '/cart',
} as const

