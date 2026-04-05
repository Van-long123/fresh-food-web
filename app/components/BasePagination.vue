<template>
  <nav v-if="totalPages > 1" class="pagination-wrap" aria-label="Pagination">
    <!-- ── DESKTOP ── -->
    <div class="desktop-pagination">
      <!-- Prev button -->
      <button
        type="button"
        class="nav-btn"
        :class="{ disabled: modelValue <= 1 }"
        :disabled="modelValue <= 1"
        @click="goTo(modelValue - 1)"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        <span>Trước</span>
      </button>

      <!-- Page buttons -->
      <template v-for="(page, idx) in pages" :key="idx">
        <span v-if="page === '...'" class="ellipsis">…</span>
        <button
          v-else
          type="button"
          class="page-btn"
          :class="{ active: page === modelValue }"
          @click="goTo(page as number)"
        >
          {{ page }}
        </button>
      </template>

      <!-- Next button -->
      <button
        type="button"
        class="nav-btn"
        :class="{ disabled: modelValue >= totalPages }"
        :disabled="modelValue >= totalPages"
        @click="goTo(modelValue + 1)"
      >
        <span>Tiếp</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
    </div>

    <!-- ── MOBILE ── -->
    <div class="mobile-pagination">
      <button
        type="button"
        class="mob-btn mob-prev"
        :disabled="modelValue <= 1"
        @click="goTo(modelValue - 1)"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        Trước
      </button>

      <span class="mob-info">
        Trang <strong>{{ modelValue }}</strong> / {{ totalPages }}
      </span>

      <button
        type="button"
        class="mob-btn mob-next"
        :disabled="modelValue >= totalPages"
        @click="goTo(modelValue + 1)"
      >
        Tiếp
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
    </div>

    <!-- Info line -->
    <p class="pagination-info">
      Hiển thị {{ rangeStart }}–{{ rangeEnd }} trong tổng số {{ total }} sản phẩm
    </p>
  </nav>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    modelValue: number;
    total: number;
    perPage?: number;
    maxVisible?: number;
  }>(),
  {
    perPage: 30,
    maxVisible: 5,
  },
);

const emit = defineEmits<{
  "update:modelValue": [page: number];
  change: [page: number];
}>();

const totalPages = computed(() =>
  Math.max(1, Math.ceil(props.total / props.perPage)),
);

const rangeStart = computed(() =>
  Math.min((props.modelValue - 1) * props.perPage + 1, props.total),
);

const rangeEnd = computed(() =>
  Math.min(props.modelValue * props.perPage, props.total),
);

const pages = computed<(number | "...")[]>(() => {
  const n = totalPages.value;
  const mv = props.maxVisible;
  const cur = props.modelValue;

  if (n <= mv + 2) {
    return Array.from({ length: n }, (_, i) => i + 1);
  }

  if (cur <= 3) {
    const left = Array.from({ length: Math.min(mv, n) }, (_, i) => i + 1);
    return [...left, "...", n];
  }

  if (cur >= n - 2) {
    const right = Array.from(
      { length: Math.min(mv, n) },
      (_, i) => n - Math.min(mv, n) + 1 + i,
    );
    return [1, "...", ...right];
  }

  const half = Math.floor((mv - 1) / 2);
  const center = Array.from(
    { length: mv - 2 },
    (_, i) => cur - half + i,
  ).filter((p) => p > 1 && p < n);

  return [1, "...", ...center, "...", n];
});

const goTo = (page: number) => {
  const clamped = Math.max(1, Math.min(page, totalPages.value));
  if (clamped === props.modelValue) return;
  emit("update:modelValue", clamped);
  emit("change", clamped);
};
</script>

<style scoped>
/* ── Container ── */
.pagination-wrap {
  padding: 24px 0 8px;
}

/* ── Desktop ── */
.desktop-pagination {
  display: none;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

@media (min-width: 640px) {
  .desktop-pagination {
    display: flex;
  }
}

/* ── Nav buttons (Trước / Tiếp) ── */
.nav-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 16px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #374151;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 180ms ease;
  user-select: none;
}

.nav-btn:hover:not(:disabled) {
  border-color: #f47f20;
  color: #f47f20;
  background: #fff3e8;
}

.nav-btn.disabled,
.nav-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  pointer-events: none;
}

/* ── Page buttons ── */
.page-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #374151;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 180ms ease;
  user-select: none;
}

.page-btn:hover:not(.active) {
  border-color: #f47f20;
  color: #f47f20;
  background: #fff3e8;
}

.page-btn.active {
  background: #f47f20;
  border-color: #f47f20;
  color: #fff;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(244, 127, 32, 0.35);
  transform: scale(1.05);
}

/* ── Ellipsis ── */
.ellipsis {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  color: #9ca3af;
  font-size: 14px;
  font-weight: 600;
  user-select: none;
  letter-spacing: 2px;
}

/* ── Mobile ── */
.mobile-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

@media (min-width: 640px) {
  .mobile-pagination {
    display: none;
  }
}

.mob-info {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
}

.mob-info strong {
  color: #f47f20;
  font-weight: 700;
}

.mob-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 36px;
  padding: 0 20px;
  border-radius: 9999px;
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #374151;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 180ms ease;
}

.mob-btn:disabled {
  opacity: 0.4;
  pointer-events: none;
}

.mob-next {
  background: #f47f20;
  border-color: #f47f20;
  color: #fff;
}

.mob-next:hover:not(:disabled) {
  background: #e06d10;
}

.mob-prev:hover:not(:disabled) {
  border-color: #f47f20;
  color: #f47f20;
  background: #fff3e8;
}

/* ── Info line ── */
.pagination-info {
  text-align: center;
  font-size: 12px;
  color: #9ca3af;
  margin: 4px 0 0;
}
</style>
