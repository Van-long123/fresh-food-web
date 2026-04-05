<template>
  <div>
    <AboutUs />
  </div>
</template>

<script setup lang="ts">
import AboutUs from '~/components/AboutUs.vue'

useHead({
  title: 'Về Chúng Tôi — SmartFood',
  meta: [
    { name: 'description', content: 'Câu chuyện SmartFood — hành trình mang thực phẩm sạch, an toàn đến từng bữa ăn người Việt từ năm 2018. Tìm hiểu sứ mệnh, giá trị và đội ngũ của chúng tôi.' },
  ],
})
</script>
