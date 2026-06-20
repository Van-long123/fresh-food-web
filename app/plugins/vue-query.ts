import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'

export default defineNuxtPlugin((nuxtApp) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 phút

        retry: (failureCount, error: any) => {
          if (error?.response?.status === 401) return false
          return failureCount < 2
        },

        refetchOnWindowFocus: false,

        refetchOnReconnect: true,

        // Nếu trong Cache (RAM) đã có sẵn dữ liệu của trang này rồi, thì khi người dùng quay lại trang, CỨ LẤY DỮ LIỆU TỪ CACHE RA MÀ DÙNG, TUYỆT ĐỐI KHÔNG ĐƯỢC GỌI LẠI API MỚI NỮA
        refetchOnMount: false,
      },

      mutations: {
        retry: 1,
      },
    },
  })

  nuxtApp.vueApp.use(VueQueryPlugin, {
    queryClient,
  })
})