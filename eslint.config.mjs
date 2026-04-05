import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    // --- Các rule bạn yêu cầu ---
    
    // Bỏ qua quy tắc bắt buộc nén tên component thành nhiều từ (rất tiện ở Nuxt vì cơ chế auto-import)
    'vue/multi-word-component-names': 'off',
    
    // Cảnh báo khi dùng v-html (phòng chống lỗ hổng XSS - Cross-Site Scripting)
    'vue/no-v-html': 'warn',
    
    // Tắt cảnh báo console.log khi code dev, nhưng cảnh báo lúc build (production) để tránh rác log
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    
    // Tắt lỗi debugger khi dev, nhưng báo lỗi nếu lỡ quên debugger lúc build để tránh crash/lộ code
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

    // --- Các rule mở rộng rất khuyên dùng cho dự án Nuxt + TypeScript ---
    
    // 1. Cảnh báo biến khai báo nhưng không bao giờ sử dụng (giúp loại bỏ code rác hoặc logic nhầm lẫn)
    '@typescript-eslint/no-unused-vars': 'warn',
    
    'vue/no-v-model-argument': 'off',
    
    // 3. Giới hạn số lượng thuộc tính (props/attributes) trên 1 dòng của thẻ HTML để code không bị dài theo chiều dọc, dễ đọc hơn.
    'vue/max-attributes-per-line': ['warn', {
      singleline: { max: 4 },
      multiline: { max: 1 }
    }],
    
    // 4. Cảnh báo khi bạn khai báo kiểu dữ liệu 'any' (Tránh lạm dụng 'any' làm mất đi ý nghĩa của TypeScript)
    '@typescript-eslint/no-explicit-any': 'warn',

    // Tắt quy tắc yêu cầu/không cho phép tự đóng thẻ (Ví dụ: <img />)
    'vue/html-self-closing': 'off'
  }
})
