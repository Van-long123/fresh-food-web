import { computed, ref } from 'vue'
import type { ForgotPasswordPageState } from '~/types/user.type'
import { useForgotPasswordMutation } from '~/mutations/user/useForgotPasswordMutation'
import { validateForgotPasswordEmail } from '~/utils/authFormUtils'

const TOTAL_SECONDS = 59

export const useForgotPassword = () => {
  const forgotPasswordMutation = useForgotPasswordMutation()

  const state = ref<ForgotPasswordPageState>('input')
  const email = ref('')
  const emailError = ref('')
  const countdown = ref(0)
  let countdownTimer: ReturnType<typeof setInterval> | null = null

  const circumference = computed(() => 2 * Math.PI * 27)
  const dashOffset = computed(() => {
    const fraction = countdown.value / TOTAL_SECONDS
    return circumference.value * (1 - fraction)
  })

  const countdownText = computed(() => {
    if (countdown.value > 0) return `Gửi lại sau ${countdown.value}s`
    return 'Có thể gửi lại'
  })

  const validate = () => {
    emailError.value = validateForgotPasswordEmail(email.value)
    return !emailError.value
  }

  const clearTimer = () => {
    if (countdownTimer) {
      clearInterval(countdownTimer)
      countdownTimer = null
    }
  }

  const startCountdown = () => {
    clearTimer()
    countdown.value = TOTAL_SECONDS
    countdownTimer = setInterval(() => {
      countdown.value -= 1
      if (countdown.value <= 0) {
        clearTimer()
        countdown.value = 0
      }
    }, 1000)
  }

  const handleSend = async () => {
    if (!validate()) return

    try {
      await forgotPasswordMutation.mutateAsync({ email: email.value })
      state.value = 'success'
      startCountdown()
      return { ok: true as const }
    } catch {
      state.value = 'error'
      return { ok: false as const }
    }
  }

  const handleResend = async () => {
    if (countdown.value > 0) return { ok: false as const }

    try {
      await forgotPasswordMutation.mutateAsync({ email: email.value })
      startCountdown()
      return { ok: true as const }
    } catch {
      return { ok: false as const }
    }
  }

  const resetState = () => {
    state.value = 'input'
    emailError.value = ''
    countdown.value = 0
    clearTimer()
  }

  return {
    state,
    email,
    emailError,
    loading: computed(() => forgotPasswordMutation.isPending.value),
    countdown,
    circumference,
    dashOffset,
    countdownText,
    handleSend,
    handleResend,
    resetState,
    clearTimer
  }
}
