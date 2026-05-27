export const PERMISSIONS = {
  DASHBOARD: {
    VIEW: 'dashboard.view'
  },
  PRODUCTS: {
    VIEW: 'products.view',
    CREATE: 'products.create',
    EDIT: 'products.edit',
    DELETE: 'products.delete'
  },
  CATEGORIES: {
    VIEW: 'categories.view',
    CREATE: 'categories.create',
    EDIT: 'categories.edit',
    DELETE: 'categories.delete'
  },
  ARTICLES: {
    VIEW: 'articles.view',
    CREATE: 'articles.create',
    EDIT: 'articles.edit',
    DELETE: 'articles.delete'
  },
  ORDERS: {
    VIEW: 'orders.view',
    EDIT: 'orders.edit'
  },
  USERS: {
    VIEW: 'users.view',
    CREATE: 'users.create',
    EDIT: 'users.edit',
    DELETE: 'users.delete'
  },
  ROLES: {
    VIEW: 'roles.view',
    CREATE: 'roles.create',
    EDIT: 'roles.edit',
    DELETE: 'roles.delete'
  },
  VOUCHERS: {
    VIEW: 'vouchers.view',
    CREATE: 'vouchers.create',
    EDIT: 'vouchers.edit',
    DELETE: 'vouchers.delete'
  },
  REFUND_REQUESTS: {
    VIEW: 'refund_requests.view',
    EDIT: 'refund_requests.edit'
  },
  REVIEWS: {
    VIEW: 'reviews.view',
    EDIT: 'reviews.edit'
  },
  PAYMENTS: {
    VIEW: 'payments.view',
    EDIT: 'payments.edit'
  },
  SETTINGS: {
    VIEW: 'settings.view',
    EDIT: 'settings.edit'
  },
  PROFILE: {
    VIEW: 'profile.view',
    EDIT: 'profile.edit'
  }
} as const

export const PERMISSION_ACTIONS = ['view', 'create', 'edit', 'delete'] as const
export type PermissionAction = (typeof PERMISSION_ACTIONS)[number]

export const PERMISSION_MODULES = [
  { key: 'dashboard', label: 'Tổng quan', actions: ['view'] },
  { key: 'products', label: 'Sản phẩm', actions: ['view', 'create', 'edit', 'delete'] },
  { key: 'categories', label: 'Danh mục', actions: ['view', 'create', 'edit', 'delete'] },
  { key: 'articles', label: 'Bài viết', actions: ['view', 'create', 'edit', 'delete'] },
  { key: 'orders', label: 'Đơn hàng', actions: ['view', 'edit'] },
  { key: 'users', label: 'Người dùng', actions: ['view', 'create', 'edit', 'delete'] },
  { key: 'roles', label: 'Vai trò', actions: ['view', 'create', 'edit', 'delete'] },
  { key: 'vouchers', label: 'Mã giảm giá', actions: ['view', 'create', 'edit', 'delete'] },
  { key: 'refund_requests', label: 'Yêu cầu hoàn tiền', actions: ['view', 'edit'] },
  { key: 'reviews', label: 'Đánh giá', actions: ['view', 'edit'] },
  { key: 'payments', label: 'Thanh toán', actions: ['view', 'edit'] },
  { key: 'settings', label: 'Cài đặt', actions: ['view', 'edit'] },
  { key: 'profile', label: 'Hồ sơ', actions: ['view', 'edit'] }
] as const
