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
                console.log("🚀 ~ createAuthorizedAxios ~ refreshError:", 'refreshError')
                await performLogout(baseURL)
              return Promise.reject(refreshError)
            })
            .finally(() => {
              refreshTokenPromise = null
            })
        }

        return refreshTokenPromise.then((_accessToken) => instance(originalRequest))
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
