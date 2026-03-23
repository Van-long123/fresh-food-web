# Food E-commerce Project

Dự án này sử dụng 스택 công nghệ mới nhất: **Nuxt 4**, **PrimeVue**, **Tailwind CSS v4** và **ESLint**.

## 🚀 Hướng dẫn Cài đặt & Khởi tạo (Setup Guide)

Dưới đây là các bước chi tiết để setup lại một dự án giống hệt như thế này từ con số 0:

### Bước 1: Khởi tạo dự án Nuxt 4
Mở terminal và gõ lệnh sau để tạo thư mục mới (thay `my-project` bằng tên tuỳ ý):
```bash
npx nuxi@latest init my-project
cd my-project
```

### Bước 2: Cài đặt các Package cần thiết
Cài đặt Tailwind CSS v4, PrimeVue và Công cụ kiểm tra code ESLint (phiên bản chuẩn của Nuxt):
```bash
# 1. Cài đặt Tailwind CSS v4 (qua Vite plugin)
npm install -D tailwindcss @tailwindcss/vite

# 2. Cài đặt PrimeVue, Themes (Aura) và Thư viện Icons
npm install primevue @primevue/themes @primevue/nuxt-module primeicons

# 3. Cài đặt ESLint chuyên dụng cho hệ sinh thái Nuxt
npm install -D eslint @nuxt/eslint
```

### Bước 3: Cấu hình cốt lõi \`nuxt.config.ts\`
Mở file `nuxt.config.ts` ở thư mục gốc và nhập cấu hình sau để liên kết tất cả thư viện lại với nhau:
```typescript
import tailwindcss from '@tailwindcss/vite';
import Aura from '@primevue/themes/aura';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@primevue/nuxt-module',
    '@nuxt/eslint'
  ],

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
```

### Bước 4: Cấu hình Tailwind CSS v4
Nuxt 4 đặt sẵn cấu trúc source nằm ở mục `app/`. Bạn tạo file `app/assets/css/main.css` (tự động tạo folder nếu chưa có) và nhét code sau vào:
```css
@import "tailwindcss";

@theme {
  /* Bạn có thể ghi đè biến màu sắc ở đây */
}
```

### Bước 5: Thiết lập Bộ quy tắc ESLint \`eslint.config.mjs\`
Tạo file `eslint.config.mjs` tại thư mục gốc, dùng hàm `withNuxt` để tự động ăn khớp với chuẩn Vue 3. Mình đã cài thêm các bộ quy tắc tiện lợi:
```javascript
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    'vue/multi-word-component-names': 'off',
    'vue/no-v-html': 'warn',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

    '@typescript-eslint/no-unused-vars': 'warn',
    'vue/html-self-closing': ['error', {
      html: { void: 'always', normal: 'always', component: 'always' },
      svg: 'always',
      math: 'always'
    }],
    'vue/max-attributes-per-line': ['warn', {
      singleline: { max: 4 },
      multiline: { max: 1 }
    }],
    '@typescript-eslint/no-explicit-any': 'warn'
  }
})
```

Và thêm Scripts để kiểm tra code vào `package.json`:
```json
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
```

### Bước 6: Kích hoạt hiển thị lỗi tự động trên VS Code
Ghi đè hoặc tạo file `.vscode/settings.json` tại thư mục gốc của dự án với nội dung:
```json
{
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "vue"
  ],
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "eslint.experimental.useFlatConfig": true
}
```
*Lưu ý: Phải tải đuôi mở rộng (Extension) `ESLint` trên VS Code để cấu hình này hoạt động.*

### Xong! Chạy project 🚀
Mở file `app/app.vue`, thay nội dung trang web bằng `<NuxtPage />` (để kết xuất các trang nằm ở mục `app/pages`) và gõ lệnh chạy:
```bash
npm run dev
```
