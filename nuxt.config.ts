import tailwindcss from '@tailwindcss/vite';
import Aura from '@primevue/themes/aura';

  export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },

    modules: [
      '@primevue/nuxt-module',
      '@nuxt/eslint',
      '@nuxtjs/google-fonts',
      '@pinia/nuxt',
      'pinia-plugin-persistedstate/nuxt',
    ],

    imports: {
      dirs: ['composables/**', 'composables']
    },

    // Tắt path prefix — components/common/AppLoading.vue → <AppLoading>, không phải <CommonAppLoading>
    components: [
      { path: '~/components', pathPrefix: false }
    ],

    googleFonts: {
      families: {
        Inter: [300, 400, 500, 600, 700, 900]
      }
    },

  primevue: {
    options: {
      theme: {
        preset: Aura
      }
    }
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: 'http://localhost:8017'
      // apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8017'
    }
  },

  vite: {
    plugins: [
      tailwindcss(),
    ],
    optimizeDeps: {
      include: ['lodash', '@tinymce/tinymce-vue', 'dayjs'],
    },
  },

  css: ['~/assets/css/main.css', 'primeicons/primeicons.css']
})

