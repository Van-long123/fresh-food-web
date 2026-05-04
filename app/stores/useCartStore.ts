import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useAuthStore } from '~/stores/useAuthStore'
import type { CartItem } from '~/types/cart.type'

export const useCartStore = defineStore('cart', () => {
  const authStore = useAuthStore()

  // State (Chỉ lưu trữ Data Cốt lõi)
  const cartItems = ref<CartItem[]>([])
  const savedAt = ref<number>(0)

  // Getters
  const itemCount = computed(() => cartItems.value.length)
  const totalCartItems = computed(() => cartItems.value.length)
  const totalAmount = computed(() =>
    cartItems.value.reduce((sum, item) => sum + item.quantity * item.price, 0)
  )

  // Mutations
  const setCartItems = (items: CartItem[]) => {
    cartItems.value = items
    savedAt.value = Date.now()
  }

  const clearGuestCart = () => {
    cartItems.value = []
    savedAt.value = 0
  }

  // Auto cleanup on logout
  watch(
    () => authStore.isLoggedIn,
    (loggedIn) => {
      if (!loggedIn) {
        clearGuestCart()
        if (typeof window !== 'undefined') {
          localStorage.removeItem('smartfood-cart')
        }
      }
    }
  )

  return {
    cartItems,
    savedAt,
    itemCount,
    totalCartItems,
    totalAmount,
    
    // Actions
    setCartItems,
    clearGuestCart
  }
}, {
  persist: {
    key: 'smartfood-cart',
    pick: ['cartItems', 'savedAt'],
    // Chạy trước khi load data từ localStorage vào store
    beforeRestore: () => {
      if (typeof window === 'undefined') return true
      const authData = localStorage.getItem('smartfood-auth')
      if (authData) {
        try {
          const parsed = JSON.parse(authData)
          if (parsed.user) return false // KHÔNG restore cart từ localStorage
        } catch (e) {
          return true
        }
      }
      return true
    },
    // override cách Pinia lưu data
    storage: {
      getItem: (key) => (typeof window !== 'undefined' ? localStorage.getItem(key) : null),
      removeItem: (key) => (typeof window !== 'undefined' ? localStorage.removeItem(key) : undefined),
      setItem: (key, value) => {
        if (typeof window === 'undefined') return
        const authData = localStorage.getItem('smartfood-auth')
        let isGuest = true
        if (authData) {
          try {
            const parsed = JSON.parse(authData)
            if (parsed.user) isGuest = false
          } catch (e) {
            //
          }
        }

        if (isGuest) {
          localStorage.setItem(key, value) // Guest (chưa login) lưu cart vào localStorage
        } else {
          localStorage.removeItem(key)
        }
      }
    }
  }
})
