import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
import ToastEventBus from 'primevue/toasteventbus'
import { API_ENDPOINTS } from '~/constants/api'
import { useAuthStore } from '~/stores/useAuthStore'

type ApiErrorResponse = {
  message?: string
}

let authorizedAxiosInstance: AxiosInstance | null = null
let refreshTokenPromise: Promise<string | undefined> | null = null
let logoutPromise: Promise<void> | null = null
let lastErrorToastMessage = ''
let lastErrorToastAt = 0

const showErrorToast = (message: string) => {
  if (!import.meta.client) return

  const now = Date.now()
  if (message === lastErrorToastMessage && now - lastErrorToastAt < 1200) {
    return
  }

  lastErrorToastMessage = message
  lastErrorToastAt = now

  try {
    ToastEventBus.emit('add', {
      severity: 'error',
      summary: 'Lỗi',
      detail: message,
      life: 3500
    })
  } catch {
    // Trường hợp chưa mount ToastService thì fallback về console để không làm hỏng luồng API.
    console.error(message)
  }
}

const performLogout = async (baseURL: string) => {
  if (logoutPromise) return logoutPromise

  logoutPromise = (async () => {
    try {
      await axios.delete(`${baseURL}${API_ENDPOINTS.AUTH.LOGOUT}`, { withCredentials: true })
    } catch {
      // Bỏ qua lỗi API logout, vẫn dọn phiên phía client.
    } finally {
      if (import.meta.client) {
        const authStore = useAuthStore()
        authStore.logout()
        window.location.href = '/auth/login'
      }
    }
  })().finally(() => {
    logoutPromise = null
  })

  return logoutPromise
}

const createAuthorizedAxios = (baseURL: string) => {
  const instance = axios.create({
    baseURL,
    timeout: 1000 * 60 * 10,
    withCredentials: true
  })

  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ApiErrorResponse>) => {
      const originalRequest = error.config as InternalAxiosRequestConfig | undefined
      const status = error.response?.status

      // Trường hợp 1: Nếu như nhận mã 401 từ BE, thì gọi api đăng xuất luôn
      if (status === 401) {
        await performLogout(baseURL)
      }

      // Trường hợp 2: Nếu như nhận mã 410 từ BE, thì sẽ gọi api refresh token để làm mới lại accessToken
      if (status === 410 && originalRequest) {
        if (!refreshTokenPromise) {
          refreshTokenPromise = axios
            .get(`${baseURL}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`, { withCredentials: true })
            .then((response) => response.data?.accessToken as string | undefined)
            .catch(async (refreshError) => {
              await performLogout(baseURL)
              return Promise.reject(refreshError)
            })
            .finally(() => {
              refreshTokenPromise = null
            })
        }

        return refreshTokenPromise.then((_accessToken) => instance(originalRequest))
      }

      // Xử lý tập trung phần hiển thị thông báo lỗi trả về từ mọi API ở đây
      let errorMessage = error.message
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      }

      // Ngoại trừ mã 410 - GONE phục vụ việc tự động refresh lại token.
      if (status !== 410) {
        showErrorToast(errorMessage || 'Có lỗi xảy ra, vui lòng thử lại.')
      }

      return Promise.reject(error)
    }
  )

  return instance
}

export const getAuthorizedAxios = () => {
  if (!authorizedAxiosInstance) {
    const config = useRuntimeConfig()
    authorizedAxiosInstance = createAuthorizedAxios(config.public.apiBaseUrl as string)
  }

  return authorizedAxiosInstance
}
