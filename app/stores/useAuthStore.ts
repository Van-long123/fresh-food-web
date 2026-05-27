import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Voucher } from '~/types/order.type'
import type { AuthUser, ApiAuthUser } from '~/types/user.type'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const vouchers = ref<Voucher[]>([])
  const isLoggedIn = computed(() => Boolean(user.value))

  /**
   * Cờ in-memory (không lưu vào localStorage) xác định xem quyền admin
   * đã được gọi API resolve trong phiên làm việc hiện tại hay chưa.
   * Cờ này bị reset về false mỗi lần tải lại trang (F5), ép middleware phải gọi lại API.
   * Tránh tình trạng quyền thay đổi trên DB nhưng bị kẹt ở cache. */
  const adminPermissionsResolved = ref(false)

  /** Tương thích ngược — các component cũ vẫn dùng permissionsLoaded */
  const permissionsLoaded = computed(() => adminPermissionsResolved.value)

  function setUser(u: AuthUser) {
    user.value = u
  }

  /**
   * Ghi đè toàn bộ thông tin User (Reset lại state).
   * Thường dùng khi Đăng nhập hoặc Khôi phục phiên bản đầy đủ từ API.
   * Yêu cầu truyền vào một object chứa đầy đủ các trường dữ liệu. */
  function setUserFromApi(u: ApiAuthUser) {
    const hasPermissions = Object.prototype.hasOwnProperty.call(u, 'permissions')
    const hasRoleId = Object.prototype.hasOwnProperty.call(u, 'roleId')
    const hasIsSystem = Object.prototype.hasOwnProperty.call(u, 'isSystem')

    setUser({
      id: u._id,
      fullname: u.displayName,
      phone: u.phone,
      role: u.role,
      ...(hasRoleId ? { roleId: u.roleId ?? null } : {}),
      ...(hasPermissions ? { permissions: u.permissions ?? [] } : {}),
      ...(hasIsSystem ? { isSystem: Boolean(u.isSystem) } : {}),
      email: u.email,
      address: u.address,
      avatar: u.avatar,
      birthday: u.birthday,
      gender: u.gender,
      verified: u.verified
    })

    // Đánh dấu đã lấy quyền thành công trong session hiện tại
    if (hasPermissions || hasIsSystem) {
      adminPermissionsResolved.value = true
    }
  }
  /**
   * Cập nhật một phần thông tin User (Vá dữ liệu).
   * Chỉ cập nhật những trường mà API có trả về, CÁC TRƯỜNG CŨ SẼ ĐƯỢC GIỮ NGUYÊN.
   * Dùng khi gọi các API update nhỏ lẻ (ví dụ chỉ đổi mỗi ảnh đại diện, hoặc mỗi tên). */
  function patchUserFromApi(u: Partial<ApiAuthUser> & { _id?: string }) {
    if (!user.value) return

    const hasPermissions = Object.prototype.hasOwnProperty.call(u, 'permissions')
    const hasRoleId = Object.prototype.hasOwnProperty.call(u, 'roleId')
    const hasIsSystem = Object.prototype.hasOwnProperty.call(u, 'isSystem')

    user.value = {
      ...user.value,
      ...(u._id ? { id: u._id } : {}),
      ...(u.displayName !== undefined ? { fullname: u.displayName } : {}),
      ...(u.phone !== undefined ? { phone: u.phone } : {}),
      ...(u.role !== undefined ? { role: u.role } : {}),
      ...(hasRoleId ? { roleId: u.roleId ?? null } : {}),
      ...(hasPermissions ? { permissions: u.permissions ?? [] } : {}),
      ...(hasIsSystem ? { isSystem: Boolean(u.isSystem) } : {}),
      ...(u.email !== undefined ? { email: u.email } : {}),
      ...(u.address !== undefined ? { address: u.address } : {}),
      ...(u.avatar !== undefined ? { avatar: u.avatar } : {}),
      ...(u.birthday !== undefined ? { birthday: u.birthday } : {}),
      ...(u.gender !== undefined ? { gender: u.gender } : {}),
      ...(u.verified !== undefined ? { verified: u.verified } : {})
    }
  }

  function setVouchers(v: Voucher[]) {
    vouchers.value = v
  }

  function logout() {
    user.value = null
    vouchers.value = []
    adminPermissionsResolved.value = false
  }

  return {
    user,
    vouchers,
    isLoggedIn,
    permissionsLoaded,
    adminPermissionsResolved,
    setUser,
    setUserFromApi,
    patchUserFromApi,
    setVouchers,
    logout,
  }
}, {
  persist: {
    key: 'smartfood-auth',
    storage: piniaPluginPersistedstate.localStorage(),
    pick: ['user', 'vouchers']
  }
})
