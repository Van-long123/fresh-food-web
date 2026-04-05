import { computed, ref } from 'vue'

export interface PasswordRule {
  label: string
  met: boolean
}

export interface PasswordStrength {
  score: number        // 0-4
  label: string
  color: string
  width: string
}

export function usePasswordStrength(passwordRef: { value: string }) {
  const rules = computed<PasswordRule[]>(() => [
    { label: 'Ít nhất 8 ký tự',       met: passwordRef.value.length >= 8 },
    { label: 'Có chữ hoa (A-Z)',       met: /[A-Z]/.test(passwordRef.value) },
    { label: 'Có chữ số (0-9)',        met: /[0-9]/.test(passwordRef.value) },
    { label: 'Ký tự đặc biệt (!@#…)', met: /[^A-Za-z0-9]/.test(passwordRef.value) },
  ])

  const score = computed(() => rules.value.filter(r => r.met).length)

  const strength = computed<PasswordStrength>(() => {
    const labels = ['', 'Yếu', 'Trung bình', 'Mạnh', 'Rất mạnh']
    const colors = ['#ef4444', '#ef4444', '#f59e0b', '#22c55e', '#16a34a']
    const widths = ['0%', '25%', '50%', '75%', '100%']
    return {
      score: score.value,
      label: score.value > 0 ? labels[score.value] : '',
      color: colors[score.value] ?? '#ef4444',
      width: widths[score.value] ?? '0%',
    }
  })

  return { rules, score, strength }
}
