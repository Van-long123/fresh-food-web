import { computed, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import { ROUTES } from '~/constants/routes'
import { useLoginMutation } from '~/mutations/user/useLoginMutation'
import { useAuthStore } from '~/stores/useAuthStore'
import {
  EMAIL_FORMAT_MESSAGE,
  PASSWORD_RULE_MESSAGE,
  isValidEmail,
  isValidPassword
} from '~/utils/authFormUtils'

interface LoginForm {
  email: string
  password: string
  remember: boolean
}

interface FormErrors {
  email: string
  password: string
}

export const useLoginForm = () => {
  const toast = useToast()
  const router = useRouter()
  const route = useRoute()
  const authStore = useAuthStore()
  const loginMutation = useLoginMutation()

  const form = reactive<LoginForm>({ email: '', password: '', remember: false })
  const errors = reactive<FormErrors>({ email: '', password: '' })

  const benefits = [
    { icon: '🛒', text: '1.000+ sản phẩm tươi ngon mỗi ngày' },
    { icon: '🚀', text: 'Giao hàng tận nhà trong 2 giờ' },
    { icon: '💳', text: 'Thanh toán an toàn, bảo mật tuyệt đối' }
  ]

  const loading = computed(() => loginMutation.isPending.value)

  const clearQueryFlag = async (key: 'registered' | 'verified') => {
    await router.replace({
      path: ROUTES.AUTH.LOGIN,
      query: { ...route.query, [key]: undefined }
    })
  }

  const processQueryToast = async () => {
    if (route.query.registered === '1') {
      toast.add({
        severity: 'success',
        summary: 'Đăng ký thành công',
        detail: 'Vui lòng kiểm tra email để xác thực tài khoản trước khi đăng nhập.',
        life: 4500
      })

      await clearQueryFlag('registered')
    }

    if (route.query.verified === 'true') {
      toast.add({
        severity: 'success',
        summary: 'Thành công',
        detail: 'Xác thực tài khoản thành công!',
        life: 4000
      })

      await clearQueryFlag('verified')
    }

    if (route.query.verified === 'false') {
      toast.add({
        severity: 'error',
        summary: 'Thất bại',
        detail: 'Xác thực thất bại hoặc link đã hết hạn!',
        life: 4000
      })

      await clearQueryFlag('verified')
    }
  }

  const validate = () => {
    errors.email = ''
    errors.password = ''

    let valid = true

    if (!form.email) {
      errors.email = 'Email là bắt buộc.'
      valid = false
    } else if (!isValidEmail(form.email)) {
      errors.email = EMAIL_FORMAT_MESSAGE
      valid = false
    }

    if (!form.password) {
      errors.password = 'Mật khẩu là bắt buộc.'
      valid = false
    } else if (!isValidPassword(form.password)) {
      errors.password = PASSWORD_RULE_MESSAGE
      valid = false
    }

    return valid
  }

  const handleSubmit = async () => {
    if (loading.value) return

    if (!validate()) return

    try {
      const result = await loginMutation.mutateAsync({
        email: form.email,
        password: form.password
      })

      authStore.setUserFromApi(result)

       toast.add({
        severity: 'success',
        summary: 'Đăng nhập thành công',
        detail: `Chào mừng ${result.displayName || 'bạn'} đến với SmartFood! 🎉`,
        life: 3500
      })

      await router.push(ROUTES.HOME)
    } catch {
      // Toast lỗi được xử lý tập trung ở authorizedAxios interceptor.
    }
  }

  onMounted(processQueryToast)

  return {
    form,
    errors,
    benefits,
    loading,
    validate,
    handleSubmit,
    processQueryToast
  }
}
