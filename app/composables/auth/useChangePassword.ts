import { computed, reactive, ref } from 'vue'
import { usePasswordStrength } from '~/composables/auth/usePasswordStrength'
import { useResetPasswordMutation } from '~/mutations/user/useResetPasswordMutation'
import { useSetPasswordMutation } from '~/mutations/user/useSetPasswordMutation'
import { useUpdateProfileMutation } from '~/mutations/user/useUpdateProfileMutation'
import { PASSWORD_RULE_MESSAGE, isValidPassword } from '~/utils/authFormUtils'

interface ChangePasswordForm {
  current: string
  newPwd: string
  confirm: string
}

interface ChangePasswordErrors {
  current: string
  newPwd: string
  confirm: string
}

// const REDIRECT_SECONDS = 3

export const useChangePassword = (mode: 'authenticated' | 'reset-link' | 'set-password') => {
  const updateProfileMutation = useUpdateProfileMutation()
  const resetPasswordMutation = useResetPasswordMutation()
  const setPasswordMutation = useSetPasswordMutation()

  const form = reactive<ChangePasswordForm>({ current: '', newPwd: '', confirm: '' })
  const errors = reactive<ChangePasswordErrors>({ current: '', newPwd: '', confirm: '' })
  const isShaking = ref(false)
  const showSuccess = ref(false)

  const newPwdRef = reactive({
    get value() {
      return form.newPwd
    }
  })

  const { rules, strength } = usePasswordStrength(newPwdRef)

  const isMatched = computed(() => form.confirm.length > 0 && form.newPwd === form.confirm)
  const isMismatched = computed(() => form.confirm.length > 0 && form.newPwd !== form.confirm)

  // const redirectCountdown = ref(REDIRECT_SECONDS)
  // const redirectProgress = computed(() => `${(redirectCountdown.value / REDIRECT_SECONDS) * 100}%`)
  let redirectTimer: ReturnType<typeof setInterval> | null = null

  const validate = () => {
    errors.current = ''
    errors.newPwd = ''
    errors.confirm = ''

    let ok = true
    if (mode === 'authenticated' && !form.current) {
      errors.current = 'Vui lòng nhập mật khẩu hiện tại.'
      ok = false
    }

    if (!form.newPwd) {
      errors.newPwd = 'Vui lòng nhập mật khẩu mới.'
      ok = false
    } else if (!isValidPassword(form.newPwd)) {
      errors.newPwd = PASSWORD_RULE_MESSAGE
      ok = false
    } else if (mode === 'authenticated' && form.newPwd === form.current) {
      errors.newPwd = 'Mật khẩu mới phải khác mật khẩu hiện tại.'
      ok = false
    }

    if (!form.confirm) {
      errors.confirm = 'Vui lòng xác nhận mật khẩu mới.'
      ok = false
    } else if (form.newPwd !== form.confirm) {
      errors.confirm = 'Xác nhận mật khẩu không khớp.'
      ok = false
    }

    return ok
  }

  const shake = () => {
    isShaking.value = true
    setTimeout(() => {
      isShaking.value = false
    }, 600)
  }

  const resetForm = () => {
    form.current = ''
    form.newPwd = ''
    form.confirm = ''
    errors.current = ''
    errors.newPwd = ''
    errors.confirm = ''
  }

  const clearRedirectTimer = () => {
    if (redirectTimer) {
      clearInterval(redirectTimer)
      redirectTimer = null
    }
  }

  // const startRedirect = (onDone: () => void) => {
  // clearRedirectTimer()
  // redirectCountdown.value = REDIRECT_SECONDS

  // redirectTimer = setInterval(() => {
  // redirectCountdown.value -= 1
  // if (redirectCountdown.value <= 0) {
  // clearRedirectTimer()
  // onDone()
  // }
  // }, 1000)
  // }

  const submitAuthenticatedChange = async () => {
    await updateProfileMutation.mutateAsync({
      current_password: form.current,
      new_password: form.newPwd
    })
  }

  const submitResetByToken = async (email: string, token: string) => {
    await resetPasswordMutation.mutateAsync({
      email,
      token,
      newPassword: form.newPwd
    })
  }

  const submitSetPassword = async (token: string) => {
    await setPasswordMutation.mutateAsync({
      token,
      newPassword: form.newPwd
    })
  }

  return {
    form,
    errors,
    loading: computed(
      () =>
        updateProfileMutation.isPending.value ||
        resetPasswordMutation.isPending.value ||
        setPasswordMutation.isPending.value
    ),
    isShaking,
    showSuccess,
    rules,
    strength,
    isMatched,
    isMismatched,
    // redirectCountdown,
    // redirectProgress,
    validate,
    shake,
    resetForm,
    // startRedirect,
    clearRedirectTimer,
    submitAuthenticatedChange,
    submitResetByToken,
    submitSetPassword
  }
}
