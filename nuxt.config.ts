import tailwindcss from '@tailwindcss/vite';
import Aura from '@primevue/themes/aura';

  export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },

    modules: [
      '@primevue/nuxt-module',
      '@nuxt/eslint',
      '@nuxtjs/google-fonts'
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

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  css: ['~/assets/css/main.css', 'primeicons/primeicons.css']
})

