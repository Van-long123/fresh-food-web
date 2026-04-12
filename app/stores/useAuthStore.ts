import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Voucher } from './useOrderStore'

export interface AuthUser {
  id: number
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

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const vouchers = ref<Voucher[]>([])
  const isLoggedIn = ref(false)

  function setUser(u: AuthUser) {
    user.value = u
    isLoggedIn.value = true
  }

  function setVouchers(v: Voucher[]) {
    vouchers.value = v
  }

  function logout() {
    user.value = null
    vouchers.value = []
    isLoggedIn.value = false
  }

  return {
    user,
    vouchers,
    isLoggedIn,
    setUser,
    setVouchers,
    logout,
  }
})
