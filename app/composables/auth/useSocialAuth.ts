import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { useAuthStore } from '~/stores/useAuthStore'
import { userService } from '~/services/user.service'
import { API_ENDPOINTS } from '~/constants/api'
import { ROUTES } from '~/constants/routes'
import type { OAuthProvider, SocialLoginOption } from '~/types/user.type'
import { useCart } from '~/composables/cart/useCart'

export const useSocialAuth = () => {
  const router = useRouter()
  const toast = useToast()
  const authStore = useAuthStore()
  const { syncAfterLogin } = useCart()

  const isLoading = ref(false)

  const apiBaseUrl = computed(() => {
    const config = useRuntimeConfig()
    return (config.public.apiBaseUrl as string)
  })

  const socialLoginOptions = computed<SocialLoginOption[]>(() => [
    {
      provider: 'google',
      label: 'Google',
      loginUrl: `${apiBaseUrl.value}${API_ENDPOINTS.AUTH.GOOGLE_LOGIN}`,
      icon: 'google'
    },
    {
      provider: 'facebook',
      label: 'Facebook',
      loginUrl: `${apiBaseUrl.value}${API_ENDPOINTS.AUTH.FACEBOOK_LOGIN}`,
      icon: 'facebook'
    }
  ])

  const googleLoginUrl = computed(
    () => `${apiBaseUrl.value}${API_ENDPOINTS.AUTH.GOOGLE_LOGIN}`
  )

  const facebookLoginUrl = computed(
    () => `${apiBaseUrl.value}${API_ENDPOINTS.AUTH.FACEBOOK_LOGIN}`
  )

  const redirectToOAuth = (provider: OAuthProvider) => {
    const urlMap: Record<OAuthProvider, string> = {
      google: googleLoginUrl.value,
      facebook: facebookLoginUrl.value
    }
    window.location.href = urlMap[provider]
  }

  const getRedirectPathByRole = (role?: string) => {
    return role === 'admin' ? ROUTES.ADMIN.DASHBOARD : ROUTES.HOME
  }

  const loginWithGoogle = () => redirectToOAuth('google')
  const loginWithFacebook = () => redirectToOAuth('facebook')

  const handleOAuthCallback = async (userId: string | null) => {
    if (!userId) {
      toast.add({
        severity: 'error',
        summary: 'Đăng nhập thất bại',
        detail: 'Không nhận được thông tin xác thực. Vui lòng thử lại.',
        life: 4000
      })
      await router.replace(ROUTES.AUTH.LOGIN)
      return
    }

    isLoading.value = true

    try {
      // Cookie đã được BE set — chỉ cần gọi verify để lấy user info
      const userInfo = await userService.verifyOAuth({ userId })

      authStore.setUserFromApi(userInfo)

      try {
        await syncAfterLogin()
      } catch (err) {

        toast.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Lỗi đồng bộ giỏ hàng sau đăng nhập',
        life: 3000
      })
      }

      toast.add({
        severity: 'success',
        summary: 'Đăng nhập thành công',
        detail: `Chào mừng ${userInfo.displayName || 'bạn'} đến với SmartFood! 🎉`,
        life: 3500
      })

      await router.replace(getRedirectPathByRole(userInfo.role))
    } catch {
      toast.add({
        severity: 'error',
        summary: 'Xác thực thất bại',
        detail: 'Phiên đăng nhập xã hội không hợp lệ. Vui lòng thử lại.',
        life: 4000
      })
      await router.replace(ROUTES.AUTH.LOGIN)
    } finally {
      isLoading.value = false
    }
  }

  const handleOAuthError = () => {
    toast.add({
      severity: 'error',
      summary: 'Đăng nhập thất bại',
      detail: 'Xác thực qua mạng xã hội thất bại. Vui lòng thử lại hoặc dùng email.',
      life: 4500
    })
  }

  return {
    isLoading,
    socialLoginOptions,
    googleLoginUrl,
    facebookLoginUrl,
    loginWithGoogle,
    loginWithFacebook,
    redirectToOAuth,
    handleOAuthCallback,
    handleOAuthError
  }
}
