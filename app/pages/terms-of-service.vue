<template>
  <div>
    <ServiceTerms />
  </div>
</template>

<script setup lang="ts">
import ServiceTerms from '~/components/ServiceTerms.vue'

useHead({
  title: 'Điều Khoản Dịch Vụ — SmartFood',
  meta: [
    {
      name: 'description',
      content:
        'Điều khoản dịch vụ SmartFood — quy định về đặt hàng, thanh toán, giao hàng, đổi trả và hoàn tiền. Cập nhật 01/01/2025.',
    },
  ],
})
</script>
