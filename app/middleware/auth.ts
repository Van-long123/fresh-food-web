import { ROUTES } from '~/constants/routes'
import { useAuthStore } from '~/stores/useAuthStore'

export default defineNuxtRouteMiddleware(() => {
  if (!import.meta.client) return

  const authStore = useAuthStore()
  if (!authStore.user) {
    return navigateTo(ROUTES.AUTH.LOGIN)
  }
})
