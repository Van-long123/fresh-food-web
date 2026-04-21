import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Voucher } from './useOrderStore'

export interface AuthUser {
  id: string
  fullname: string
  phone: string
  email?: string
  address?: string
  ward?: string
  wardCode?: number
  district?: string
  districtCode?: number
  province?: string
  provinceCode?: number
  avatar?: string
}

export interface ApiAuthUser {
  _id: string
  displayName: string
  phone: string
  email?: string
  address?: string
  ward?: string
  ward_code?: number
  district?: string
  district_code?: number
  province?: string
  province_code?: number
  avatar?: string
}

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
      ward: u.ward,
      wardCode: u.ward_code,
      district: u.district,
      districtCode: u.district_code,
      province: u.province,
      provinceCode: u.province_code,
      avatar: u.avatar
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
