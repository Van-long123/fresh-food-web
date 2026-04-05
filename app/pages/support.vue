<template>
  <div>
    <CustomerSupport />
  </div>
</template>

<script setup lang="ts">
import CustomerSupport from '~/components/CustomerSupport.vue'

useHead({
  title: 'Hỗ Trợ Khách Hàng — SmartFood',
  meta: [
    { name: 'description', content: 'Liên hệ hỗ trợ SmartFood 24/7 qua hotline, live chat, email và Zalo. Giải đáp mọi thắc mắc về đặt hàng, giao hàng, thanh toán và đổi trả.' },
  ],
})
</script>
