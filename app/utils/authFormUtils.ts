export const EMAIL_REGEX = /^\S+@\S+\.\S+$/
export const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,256}$/
export const PHONE_REGEX = /^[0-9]{8,11}$/

export const EMAIL_FORMAT_MESSAGE = 'Email không đúng định dạng.'
export const PASSWORD_RULE_MESSAGE = 'Mật khẩu phải có ít nhất 8 ký tự, chứa ít nhất 1 chữ hoa, 1 số và 1 ký tự đặc biệt (!@#...)'
export const PHONE_FORMAT_MESSAGE = 'Số điện thoại không hợp lệ.'

export const isValidEmail = (email: string) => EMAIL_REGEX.test(email)
export const isValidPassword = (password: string) => PASSWORD_REGEX.test(password)
export const isValidPhone = (phone: string) => PHONE_REGEX.test(phone.replace(/\s/g, ''))

export const validateForgotPasswordEmail = (email: string) => {
  if (!email) return 'Email là bắt buộc.'
  if (!isValidEmail(email)) return EMAIL_FORMAT_MESSAGE
  return ''
}

export const getPasswordRuleFlags = (password: string) => ({
  minLength: password.length >= 8,
  hasUppercase: /[A-Z]/.test(password),
  hasNumber: /[0-9]/.test(password),
  hasSpecial: /[^A-Za-z0-9]/.test(password)
})
