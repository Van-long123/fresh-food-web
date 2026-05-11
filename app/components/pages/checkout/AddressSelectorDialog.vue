<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    modal
    header="Chọn địa chỉ giao hàng"
    :style="{ width: '500px', maxWidth: '95vw' }"
    :pt="{
      root: { class: 'rounded-2xl shadow-2xl overflow-hidden border-0' },
      header: { class: 'bg-white border-b border-gray-100 px-6 py-4' },
      title: { class: 'text-lg font-bold text-gray-900' },
      content: { class: 'p-0 bg-gray-50/50' },
      closeButton: { class: 'hover:bg-gray-100 transition-colors w-8 h-8' },
    }"
  >
    <div class="p-6">
      chọn địa chỉ giao hàng
      <div
        class="max-h-[50vh] overflow-y-auto pr-2 -mr-2 space-y-3 custom-scrollbar"
      >
        <TransitionGroup name="list">
          <div
            v-for="addr in sortedAddresses"
            :key="addr._id"
            class="relative rounded-xl border p-4 transition-all duration-200 cursor-pointer"
            :class="[
              localSelectedId === addr._id
                ? 'border-[#f47f20] bg-orange-50/40 shadow-sm'
                : 'border-gray-200 bg-white hover:border-orange-300 hover:shadow-sm',
            ]"
            @click="localSelectedId = addr._id"
          >
            <div class="flex items-start gap-3">
              <!-- Radio custom -->
              <div class="pt-1 shrink-0">
                <div
                  class="w-4 h-4 rounded-full border flex items-center justify-center transition-colors"
                  :class="
                    localSelectedId === addr._id
                      ? 'border-[#f47f20] bg-[#f47f20]'
                      : 'border-gray-300 bg-white'
                  "
                >
                  <div
                    v-if="localSelectedId === addr._id"
                    class="w-1.5 h-1.5 rounded-full bg-white"
                  ></div>
                </div>
              </div>

              <div class="flex-1 min-w-0">
                <!-- Tên & SĐT -->
                <div class="flex items-center flex-wrap gap-2 mb-1.5">
                  <span class="font-bold text-gray-900 text-sm">{{
                    addr.username
                  }}</span>
                  <span class="text-gray-300 text-xs">|</span>
                  <span class="text-gray-600 text-sm">{{ addr.phone }}</span>
                </div>

                <!-- Badges -->
                <div class="flex items-center gap-2 mb-1">
                  <span
                    v-if="addr.default === 1"
                    class="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-[#f47f20] border border-orange-200"
                  >
                    Mặc định
                  </span>
                  <span
                    v-if="addr.type"
                    class="inline-flex items-center justify-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-600 border border-gray-200"
                  >
                    {{ addr.type }}
                  </span>
                </div>

                <!-- Địa chỉ chi tiết -->
                <p class="text-sm text-gray-600 leading-relaxed truncate">
                  {{ addr.address }}, {{ addr.ward }}, {{ addr.district }},
                  {{ addr.province }}
                </p>
              </div>

              <!-- Action Sửa -->
              <div class="shrink-0 ml-4">
                <button
                  class="text-sm font-medium text-[#006ee6] hover:text-[#005bb5] transition-colors bg-transparent border-none p-1"
                  @click.stop="$emit('edit', addr)"
                >
                  Sửa
                </button>
              </div>
            </div>
          </div>
        </TransitionGroup>
      </div>

      <button
        class="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#f47f20] bg-orange-50/30 px-4 py-3 text-sm font-semibold text-[#f47f20] transition-colors hover:bg-orange-50 hover:border-solid"
        @click="$emit('add')"
      >
        <i class="pi pi-plus text-xs"></i> Thêm địa chỉ mới
      </button>
    </div>

    <template #footer>
      <div
        class="flex items-center justify-end gap-3 px-6 py-4 bg-white border-t border-gray-100"
      >
        <button
          class="rounded-xl px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
          @click="$emit('update:visible', false)"
        >
          Hủy
        </button>
        <button
          class="rounded-xl bg-[#f47f20] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#e06d10] transition-colors shadow-sm"
          @click="confirmSelection"
        >
          Xác nhận
        </button>
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import Dialog from "primevue/dialog";

const props = defineProps<{
  visible: boolean;
  addresses: any[];
  selectedAddressId: string | null;
}>();

const emit = defineEmits<{
  (e: "update:visible", value: boolean): void;
  (e: "select", id: string): void;
  (e: "add"): void;
  (e: "edit", address: any): void;
}>();

const localSelectedId = ref<string | null>(props.selectedAddressId);

watch(
  () => props.selectedAddressId,
  (newVal) => {
    localSelectedId.value = newVal;
  },
);

watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      localSelectedId.value = props.selectedAddressId;
    }
  },
);

const sortedAddresses = computed(() => {
  if (!props.addresses) return [];
  const list = [...props.addresses];
  if (!localSelectedId.value) return list;
  const index = list.findIndex((a) => a._id === localSelectedId.value);
  if (index > 0) {
    const [selected] = list.splice(index, 1);
    list.unshift(selected);
  }
  return list;
});

const confirmSelection = () => {
  if (localSelectedId.value) {
    emit("select", localSelectedId.value);
  }
  emit("update:visible", false);
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 20px;
}
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
