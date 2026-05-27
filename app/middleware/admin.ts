import { ROUTES } from '~/constants/routes'
import { PERMISSIONS } from '~/constants/permissions'
import { usePermissions } from '~/composables/auth/usePermissions'
import { useAuthStore } from '~/stores/useAuthStore'
import { adminProfileService } from '~/services/admin/profile.service'

/**
 * Admin Route Guard — bảo vệ toàn bộ /admin/*.
 *
 * Luồng xử lý:
 * 1. Xác thực cơ bản: user phải đăng nhập và có role = 'admin'
 * 2. Resolve quyền từ backend nếu chưa có (gọi /admin/auth/me)
 * 3. System admin (isSystem: true) → bypass toàn bộ permission checks
 * 4. Admin thường → kiểm tra permission cụ thể cho từng route */
export default defineNuxtRouteMiddleware(async (to) => {
  if (!import.meta.client) return

  const authStore = useAuthStore()

  //  1. Xác thực cơ bản 
  if (!authStore.user || authStore.user.role !== 'admin') {
    return navigateTo(ROUTES.HOME)
  }

  const { hasPermission, isSystem } = usePermissions()

  //  2. Resolve role permissions từ backend 
  // Kiểm tra cờ in-memory (không lưu localStorage)
  // Mỗi lần F5 cờ này sẽ là false → ép gọi API lấy quyền mới nhất để tránh bị kẹt do cache cũ.
  if (!authStore.adminPermissionsResolved) {
    try {
      const profile = await adminProfileService.getMe()
      authStore.setUserFromApi(profile)
    } catch {
      return navigateTo(ROUTES.AUTH.LOGIN)
    }
  }

  //  3. System admin → full quyền tuyệt đối 
  if (isSystem.value) return

  //  4. route guard phân quyền cho trang admin.
  // Sử dụng biểu thức chính quy (Regex) để ánh xạ từng URL của trang Admin tới một quyền tương ứng
  const routePath = to.path
  const permissionRules = [
    { pattern: /^\/admin$/, permission: PERMISSIONS.DASHBOARD.VIEW }, // Vào trang chủ admin cần quyền dashboard.view
    { pattern: /^\/admin\/profile/, permission: PERMISSIONS.PROFILE.VIEW },
    { pattern: /^\/admin\/products\/create$/, permission: PERMISSIONS.PRODUCTS.CREATE },
    { pattern: /^\/admin\/products\/[^/]+\/edit$/, permission: PERMISSIONS.PRODUCTS.EDIT },
    { pattern: /^\/admin\/products(\/)?$/, permission: PERMISSIONS.PRODUCTS.VIEW },
    { pattern: /^\/admin\/categories\/create$/, permission: PERMISSIONS.CATEGORIES.CREATE },
    { pattern: /^\/admin\/categories\/[^/]+\/edit$/, permission: PERMISSIONS.CATEGORIES.EDIT },
    { pattern: /^\/admin\/categories(\/)?$/, permission: PERMISSIONS.CATEGORIES.VIEW },
    { pattern: /^\/admin\/articles\/create$/, permission: PERMISSIONS.ARTICLES.CREATE },
    { pattern: /^\/admin\/articles\/[^/]+\/edit$/, permission: PERMISSIONS.ARTICLES.EDIT },
    { pattern: /^\/admin\/articles(\/)?$/, permission: PERMISSIONS.ARTICLES.VIEW },
    { pattern: /^\/admin\/orders\/.+/, permission: PERMISSIONS.ORDERS.VIEW },
    { pattern: /^\/admin\/orders(\/)?$/, permission: PERMISSIONS.ORDERS.VIEW },
    { pattern: /^\/admin\/users\/create$/, permission: PERMISSIONS.USERS.CREATE },
    { pattern: /^\/admin\/users\/[^/]+\/edit$/, permission: PERMISSIONS.USERS.EDIT },
    { pattern: /^\/admin\/users(\/)?$/, permission: PERMISSIONS.USERS.VIEW },
    { pattern: /^\/admin\/vouchers\/create$/, permission: PERMISSIONS.VOUCHERS.CREATE },
    { pattern: /^\/admin\/vouchers\/[^/]+\/edit$/, permission: PERMISSIONS.VOUCHERS.EDIT },
    { pattern: /^\/admin\/vouchers(\/)?$/, permission: PERMISSIONS.VOUCHERS.VIEW },
    { pattern: /^\/admin\/reviews\/.+/, permission: PERMISSIONS.REVIEWS.VIEW },
    { pattern: /^\/admin\/reviews(\/)?$/, permission: PERMISSIONS.REVIEWS.VIEW },
    { pattern: /^\/admin\/refund-requests\/.+/, permission: PERMISSIONS.REFUND_REQUESTS.VIEW },
    { pattern: /^\/admin\/refund-requests(\/)?$/, permission: PERMISSIONS.REFUND_REQUESTS.VIEW },
    { pattern: /^\/admin\/roles\/create$/, permission: PERMISSIONS.ROLES.CREATE },
    { pattern: /^\/admin\/roles\/[^/]+\/edit$/, permission: PERMISSIONS.ROLES.EDIT },
    { pattern: /^\/admin\/roles(\/)?$/, permission: PERMISSIONS.ROLES.VIEW },
    { pattern: /^\/admin\/payments(\/)?$/, permission: PERMISSIONS.PAYMENTS.VIEW },
    { pattern: /^\/admin\/settings(\/)?$/, permission: PERMISSIONS.SETTINGS.VIEW },
    { pattern: /^\/admin\/maintenance(\/)?$/, permission: PERMISSIONS.SETTINGS.VIEW },
    { pattern: /^\/admin\/pricing(\/)?$/, permission: PERMISSIONS.SETTINGS.VIEW }
  ]

  const matched = permissionRules.find((rule) => rule.pattern.test(routePath))
  if (!matched) return

  if (!hasPermission(matched.permission)) {
    // Nếu không có quyền truy cập trang hiện tại, thay vì báo lỗi 403 thô cứng,
    // ta quét từ trên xuống dưới để tìm trang đầu tiên mà admin này có quyền "Xem" (VIEW).
    // Giúp tự động điều hướng nhân viên đến đúng phân hệ của họ ngay sau khi đăng nhập.
    const firstAllowedRoute = [
      { permission: PERMISSIONS.DASHBOARD.VIEW, path: ROUTES.ADMIN.DASHBOARD },
      { permission: PERMISSIONS.ARTICLES.VIEW, path: ROUTES.ADMIN.ARTICLES },
      { permission: PERMISSIONS.PRODUCTS.VIEW, path: ROUTES.ADMIN.PRODUCTS },
      { permission: PERMISSIONS.CATEGORIES.VIEW, path: ROUTES.ADMIN.CATEGORIES },
      { permission: PERMISSIONS.ORDERS.VIEW, path: ROUTES.ADMIN.ORDERS },
      { permission: PERMISSIONS.USERS.VIEW, path: ROUTES.ADMIN.USERS },
      { permission: PERMISSIONS.VOUCHERS.VIEW, path: ROUTES.ADMIN.VOUCHERS },
      { permission: PERMISSIONS.REVIEWS.VIEW, path: ROUTES.ADMIN.REVIEWS },
      { permission: PERMISSIONS.REFUND_REQUESTS.VIEW, path: ROUTES.ADMIN.REFUND_REQUESTS },
      { permission: PERMISSIONS.ROLES.VIEW, path: ROUTES.ADMIN.ROLES },
      { permission: PERMISSIONS.PAYMENTS.VIEW, path: ROUTES.ADMIN.PAYMENTS },
      { permission: PERMISSIONS.SETTINGS.VIEW, path: ROUTES.ADMIN.SETTINGS }
    ].find((item) => hasPermission(item.permission))?.path || ROUTES.HOME

    return navigateTo(firstAllowedRoute)
  }
})