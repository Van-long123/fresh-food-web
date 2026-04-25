<template>
  <div
    class="transition-shadow duration-300 group flex flex-col h-full overflow-hidden"
  >
    <!-- Image Box -->
    <div
      class="relative pt-[100%] overflow-hidden bg-white shrink-0 cursor-pointer rounded-lg"
    >
      <!-- Top Left Tags -->
      <div
        v-if="product?.discountPercent"
        class="absolute top-0 left-0 z-10 flex items-start"
      >
        <div
          class="bg-[#fced44] text-black text-xs font-bold px-1.5 py-0.5 whitespace-nowrap"
        >
          -{{ product?.discountPercent }}%
        </div>
        <div
          v-if="product?.isOnlineExclusive"
          class="bg-linear-to-r from-[#fc5c22] to-[#fd4d2d] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-br-lg transform origin-top-left flex items-center shadow-sm ml-px border-l-2 border-white"
        >
          ĐỘC QUYỀN ONLINE
        </div>
      </div>

      <img
        :src="product.image"
        :alt="product.name"
        class="absolute inset-0 w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 rounded-lg"
        loading="lazy"
      />

      <!-- BEST PRICE banner at the bottom of the image -->
      <div
        v-if="product.isBestPrice"
        class="absolute bottom-0 left-0 right-0 h-6 bg-linear-to-r from-[#fc6a20] to-[#fd3511] flex items-center justify-between px-2 text-white overflow-hidden"
      >
        <span class="text-[11px] font-black uppercase tracking-wider"
          >BEST PRICE</span
        >
        <span class="text-sm font-black">{{ formatPrice(product.price) }}</span>
      </div>
    </div>

    <!-- Content Box -->
    <div class="flex flex-col flex-1 bg-white">
      <h3
        class="text-[13px] font-normal text-gray-800 line-clamp-2 mb-1 mt-1 group-hover:text-[#f47f20] transition-colors cursor-pointer flex-1"
        :title="product.name"
      >
        {{ product.name }}
      </h3>

      <div class="mt-auto">
        <div class="flex items-baseline gap-1.5 mb-0.5">
          <span class="text-[15px] font-bold text-[#f47f20]">{{
            formatPrice(product.price)
          }}</span>
          <span
            class="font-bold text-[#f47f20] uppercase underline align-top mr-1 text-[10px]"
            >đ</span
          >
        </div>
        <div
          class="flex items-center gap-1.5 mb-3"
          v-if="product.originalPrice"
        >
          <span class="text-[11px] text-gray-400 line-through"
            >{{ formatPrice(product.originalPrice) }} đ</span
          >
          <span class="text-[11px] font-medium text-[#10b981]"
            >Tiết kiệm
            {{ calculateSaving(product.originalPrice, product.price) }}</span
          >
        </div>
        <div class="h-4 mb-3" v-if="!product.originalPrice" />
        <!-- Spacer for alignment if no original price -->

        <!-- Action Button -->
        <button
          class="w-full h-8 flex items-center justify-center gap-1.5 bg-[#eef5fd] text-[#006ee6] font-semibold text-[13px] rounded-full hover:bg-[#d6e7f9] transition-colors duration-200"
          @click="handleBuy"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          {{ addedState ? "✓ Đã thêm" : product.buttonText || "Mua" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useCart } from "~/composables/cart/useCart";
import type { HomeProduct } from "~/types/home.type";

interface ProductCardModel extends HomeProduct {
  uniqueId?: string;
}

const props = defineProps<{
  product: ProductCardModel;
}>();

const { addToCart } = useCart();
const addedState = ref(false);

const formatPrice = (price: number): string => {
  return price.toLocaleString("vi-VN");
};

const calculateSaving = (original: number, current: number): string => {
  const saving = original - current;
  if (saving >= 1000) {
    return `${saving / 1000}K`;
  }
  return `${formatPrice(saving)}đ`;
};

const handleBuy = () => {
  addToCart({
    id: props.product.id ? Number(props.product.id) : undefined,
    name: props.product.name,
    price: props.product.price,
    image: props.product.image,
  });

  addedState.value = true;
  setTimeout(() => {
    addedState.value = false;
  }, 1000);
};
</script>
