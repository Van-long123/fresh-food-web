import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AdminSettings } from '~/types/settings.type'
import { getClientSettingsRequest } from '~/api/client/settingsApi'
import fallbackLogo from '@/assets/images/logo.png'

/** Fallback mặc định khi chưa có dữ liệu từ DB hoặc đang loading */
export const DEFAULT_SETTINGS: AdminSettings = {
  websiteName: 'SmartFood',
  logo: fallbackLogo as unknown as string,
  phone: '0775580605',
  email: 'smartfood@gmail.com',
  address: '123 Nguyễn Văn Linh, phường Nam Dương, Quận Hải Châu, Thành phố Đà Nẵng, Việt Nam',
  copyright: `© ${new Date().getFullYear()} SmartFood. All Rights Reserved.`
}

export const useSettingsStore = defineStore('settings', () => {
  const data = ref<AdminSettings | null>(null)
  const isLoaded = ref(false)
  const isLoading = ref(false)

  /** Trả về settings với fallback, luôn có giá trị hợp lệ */
  const settings = computed<AdminSettings>(() => data.value ?? DEFAULT_SETTINGS)

  const phone = computed(() => settings.value.phone || DEFAULT_SETTINGS.phone)
  const email = computed(() => settings.value.email || DEFAULT_SETTINGS.email)
  const websiteName = computed(() => settings.value.websiteName || DEFAULT_SETTINGS.websiteName)
  const address = computed(() => settings.value.address || DEFAULT_SETTINGS.address)
  const copyright = computed(() => settings.value.copyright || DEFAULT_SETTINGS.copyright)
  const logo = computed(() => {
    const l = settings.value.logo
    // Nếu DB trả về URL hợp lệ thì dùng, ngược lại fallback về logo tĩnh
    return (l && typeof l === 'string' && l.trim() !== '')
      ? l
      : (fallbackLogo as unknown as string)
  })

  /**
   * Lấy settings từ API. Chỉ gọi một lần (nếu chưa load).
   * Có thể gọi force=true để refresh.
   */
  async function fetchSettings(force = false) {
    if (isLoaded.value && !force) return
    if (isLoading.value) return

    isLoading.value = true
    try {
      const result = await getClientSettingsRequest()
      data.value = result
      isLoaded.value = true
    } catch {
      // Giữ fallback DEFAULT_SETTINGS, không crash
      isLoaded.value = true
    } finally {
      isLoading.value = false
    }
  }

  return {
    data,
    isLoaded,
    isLoading,
    settings,
    phone,
    email,
    websiteName,
    address,
    copyright,
    logo,
    fetchSettings
  }
})
