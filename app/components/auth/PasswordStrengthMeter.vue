<template>
  <div class="mt-2">
    <!-- Strength bar -->
    <div class="flex gap-1.5 mb-2">
      <div
        v-for="i in 4"
        :key="i"
        class="flex-1 h-1.5 rounded-full transition-all duration-500"
        :class="getSegmentClass(i)"
      />
    </div>
    <!-- Label -->
    <p class="text-xs font-semibold transition-colors duration-300" :class="labelColor">
      {{ label }}
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  password: { type: String, default: '' },
})

const strength = computed(() => {
  const p = props.password
  if (!p) return 0
  let score = 0
  if (p.length >= 8) score++
  if (/[A-Z]/.test(p)) score++
  if (/[0-9]/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p)) score++
  return score
})

const label = computed(() => {
  const labels = ['', 'Yếu', 'Trung bình', 'Khá', 'Mạnh']
  return strength.value > 0 ? labels[strength.value] : ''
})

const labelColor = computed(() => {
  const map = ['', 'text-red-500', 'text-orange-400', 'text-yellow-500', 'text-green-600']
  return map[strength.value] || 'text-transparent'
})

const getSegmentClass = (i) => {
  if (i > strength.value) return 'bg-gray-200'
  const colors = {
    1: 'bg-red-400',
    2: 'bg-orange-400',
    3: 'bg-yellow-400',
    4: 'bg-green-500',
  }
  return colors[strength.value] || 'bg-gray-200'
}
</script>
