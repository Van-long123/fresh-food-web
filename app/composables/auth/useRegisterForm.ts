import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ROUTES } from '~/constants/routes'
import { usePasswordStrength } from '~/composables/auth/usePasswordStrength'
import { useRegisterMutation } from '~/mutations/user/useRegisterMutation'
import {
  EMAIL_FORMAT_MESSAGE,
  PASSWORD_RULE_MESSAGE,
  isValidEmail,
  isValidPassword
} from '~/utils/authFormUtils'

interface RegisterForm {
  name: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  agreeTerms: boolean
  agreePromo: boolean
}

export const useRegisterForm = () => {
  const router = useRouter()
  const registerMutation = useRegisterMutation()

  const loading = computed(() => registerMutation.isPending.value)
  const showConfetti = ref(false)
  const currentStep = ref(1)
  const isShaking = ref(false)
  const transitionName = ref('slide-forward')

  const form = reactive<RegisterForm>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
    agreePromo: false
  })

  const step1Errors = reactive({ name: '', email: '', phone: '' })
  const step2Errors = reactive({ password: '', confirmPassword: '' })
  const step3Errors = reactive({ agreeTerms: '' })

  const steps = [
    {
      label: 'Thông tin',
      icon: '📋',
      brandTitle: 'Thông tin cơ bản',
      brandDesc: 'Tên, email và số điện thoại'
    },
    {
      label: 'Bảo mật',
      icon: '🔐',
      brandTitle: 'Thiết lập bảo mật',
      brandDesc: 'Mật khẩu mạnh, an toàn'
    },
    {
      label: 'Xác nhận',
      icon: '✅',
      brandTitle: 'Xác nhận & Hoàn tất',
      brandDesc: 'Kiểm tra rồi đăng ký'
    }
  ]

  const passwordRef = computed(() => form.password)
  const { rules: passwordRules, strength } = usePasswordStrength(passwordRef)
  const strengthWidth = computed(() => strength.value.width)
  const strengthColor = computed(() => strength.value.color)
  const strengthLabel = computed(() => strength.value.label)

  const shake = () => {
    isShaking.value = true
    setTimeout(() => {
      isShaking.value = false
    }, 600)
  }

  const validateStep1 = () => {
    step1Errors.name = ''
    step1Errors.email = ''
    step1Errors.phone = ''

    let ok = true

    if (!form.name.trim()) {
      step1Errors.name = 'Vui lòng nhập họ và tên.'
      ok = false
    }

    if (!form.email) {
      step1Errors.email = 'Email là bắt buộc.'
      ok = false
    } else if (!isValidEmail(form.email)) {
      step1Errors.email = EMAIL_FORMAT_MESSAGE
      ok = false
    }

    if (!form.phone.trim()) {
      step1Errors.phone = 'Vui lòng nhập số điện thoại.'
      ok = false
    } else if (!/^[0-9]{8,10}$/.test(form.phone.replace(/\s/g, ''))) {
      step1Errors.phone = 'Số điện thoại không hợp lệ.'
      ok = false
    }

    return ok
  }

  const validateStep2 = () => {
    step2Errors.password = ''
    step2Errors.confirmPassword = ''

    let ok = true

    if (!form.password) {
      step2Errors.password = 'Mật khẩu là bắt buộc.'
      ok = false
    } else if (!isValidPassword(form.password)) {
      step2Errors.password = PASSWORD_RULE_MESSAGE
      ok = false
    }

    if (!form.confirmPassword) {
      step2Errors.confirmPassword = 'Vui lòng xác nhận mật khẩu.'
      ok = false
    } else if (form.password !== form.confirmPassword) {
      step2Errors.confirmPassword = 'Mật khẩu không khớp.'
      ok = false
    }

    return ok
  }

  const validateStep3 = () => {
    step3Errors.agreeTerms = ''

    if (!form.agreeTerms) {
      step3Errors.agreeTerms = 'Bạn phải đồng ý với điều khoản để tiếp tục.'
      return false
    }

    return true
  }

  const goNext = (step: number) => {
    const valid = step === 1 ? validateStep1() : validateStep2()
    if (!valid) {
      shake()
      return
    }

    transitionName.value = 'slide-forward'
    currentStep.value++
  }

  const goBack = () => {
    transitionName.value = 'slide-back'
    currentStep.value--
  }

  const confettiColors = ['#f97316', '#ea580c', '#22c55e', '#16a34a', '#fbbf24', '#60a5fa', '#f472b6']

  const getConfettiStyle = (_index: number): Record<string, string> => {
    const color = confettiColors[Math.floor(Math.random() * confettiColors.length)]
    const left = `${Math.random() * 100}%`
    const delay = `${Math.random() * 2}s`
    const duration = `${2.5 + Math.random() * 2}s`
    const size = `${6 + Math.floor(Math.random() * 8)}px`

    return {
      background: color ?? '',
      left,
      animationDelay: delay,
      animationDuration: duration,
      width: size,
      height: size
    }
  }

  const fireConfetti = () => {
    showConfetti.value = true
    setTimeout(() => {
      showConfetti.value = false
    }, 4000)
  }

  const handleSubmit = async () => {
    if (!validateStep3()) {
      shake()
      return
    }

    try {
      await registerMutation.mutateAsync({
        email: form.email,
        password: form.password,
        phone: form.phone,
        displayName: form.name
      })

      fireConfetti()
      await router.push({ path: ROUTES.AUTH.LOGIN, query: { registered: '1' } })
    } catch {
      // Toast lỗi được xử lý tập trung ở authorizedAxios interceptor.
    }
  }

  return {
    form,
    loading,
    showConfetti,
    currentStep,
    isShaking,
    transitionName,
    step1Errors,
    step2Errors,
    step3Errors,
    steps,
    strengthWidth,
    strengthColor,
    strengthLabel,
    passwordRules,
    validateStep1,
    validateStep2,
    validateStep3,
    goNext,
    goBack,
    getConfettiStyle,
    handleSubmit,
    fireConfetti
  }
}
