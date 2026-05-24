import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Voucher } from '~/types/order.type'
import type { AuthUser, ApiAuthUser } from '~/types/user.type'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const vouchers = ref<Voucher[]>([])
  const isLoggedIn = computed(() => Boolean(user.value))

  function setUser(u: AuthUser) {
    user.value = u
  }

  /**
   * Ghi đè toàn bộ thông tin User (Reset lại state).
   * Thường dùng khi Đăng nhập hoặc Khôi phục phiên bản đầy đủ từ API.
   * Yêu cầu truyền vào một object chứa đầy đủ các trường dữ liệu.
   */
  function setUserFromApi(u: ApiAuthUser) {
    setUser({
      id: u._id,
      fullname: u.displayName,
      phone: u.phone,
      role: u.role,
      email: u.email,
      address: u.address,
      avatar: u.avatar,
      birthday: u.birthday,
      gender: u.gender,
      verified: u.verified
    })
  }

  /**
   * Cập nhật một phần thông tin User (Vá dữ liệu).
   * Chỉ cập nhật những trường mà API có trả về, CÁC TRƯỜNG CŨ SẼ ĐƯỢC GIỮ NGUYÊN.
   * Dùng khi gọi các API update nhỏ lẻ (ví dụ chỉ đổi mỗi ảnh đại diện, hoặc mỗi tên).
   */
  function patchUserFromApi(u: Partial<ApiAuthUser> & { _id?: string }) {
    if (!user.value) return

    user.value = {
      ...user.value,
      ...(u._id ? { id: u._id } : {}),
      ...(u.displayName !== undefined ? { fullname: u.displayName } : {}),
      ...(u.phone !== undefined ? { phone: u.phone } : {}),
      ...(u.role !== undefined ? { role: u.role } : {}),
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
  }

  return {
    user,
    vouchers,
    isLoggedIn,
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
