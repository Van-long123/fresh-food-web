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