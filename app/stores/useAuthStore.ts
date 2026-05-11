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

  function setUserFromApi(u: ApiAuthUser) {
    setUser({
      id: u._id,
      fullname: u.displayName,
      phone: u.phone,
      email: u.email,
      address: u.address,
      avatar: u.avatar,
      birthday: u.birthday,
      gender: u.gender,
      verified: u.verified
    })
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
