<template>
  <div
    class="transition-shadow duration-300 group flex flex-col h-full overflow-hidden"
  >
    <!-- Image Box -->
    <div
      class="relative pt-[100%] overflow-hidden shrink-0 cursor-pointer rounded-lg"
      :style="{ backgroundColor: bg }"
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

      <NuxtLink :to="productDetailRoute" class="absolute inset-0 block">
        <img
          :src="product.image"
          :alt="product.name"
          class="absolute inset-0 w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 rounded-lg"
          loading="lazy"
        />
      </NuxtLink>

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
    <div class="flex flex-col flex-1" :style="{ backgroundColor: bg }">
      <NuxtLink :to="productDetailRoute" class="block">
        <h3
          class="text-[13px] font-normal text-gray-800 line-clamp-2 mb-1 mt-1 group-hover:text-[#f47f20] transition-colors cursor-pointer flex-1"
          :title="product.name"
        >
          {{ product.name }}
        </h3>
      </NuxtLink>

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
          v-if="product.originalPrice"
          class="flex items-center gap-1.5 mb-3"
        >
          <span class="text-[11px] text-gray-400 line-through"
            >{{ formatPrice(product.originalPrice) }} đ</span
          >
          <span class="text-[11px] font-medium text-[#10b981]"
            >Tiết kiệm
            {{ calculateSaving(product.originalPrice, product.price) }}</span
          >
        </div>
        <div v-if="!product.originalPrice" class="h-4 mb-3" />
        <!-- Spacer for alignment if no original price -->

        <!-- Action Button -->
        <button
          class="w-full h-8 flex items-center justify-center gap-1.5 bg-[#eef5fd] text-[#006ee6] font-semibold text-[13px] rounded-full hover:bg-[#d6e7f9] transition-colors duration-200 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
          :disabled="isOutOfStock"
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
          {{
            isOutOfStock
              ? "Hết hàng"
              : addedState
                ? "✓ Đã thêm"
                : product.buttonText || "Mua"
          }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useCart } from "~/composables/cart/useCart";
import { ROUTES } from "~/constants/routes";
import type { HomeProduct } from "~/types/home.type";

interface ProductCardModel extends HomeProduct {
  uniqueId?: string;
}

const props = withDefaults(
  defineProps<{
    product: ProductCardModel;
    bg?: string;
  }>(),
  {
    bg: "#fff",
  },
);

const { addToCart } = useCart();
const addedState = ref(false);
const productDetailRoute = computed(() =>
  ROUTES.PRODUCT_DETAIL(props.product.slug || ""),
);
const isOutOfStock = computed(() => {
  const stock = props.product.stock;
  // Nếu stock chưa được load từ API (undefined/null), giả sử sản phẩm còn hàng
  return stock !== undefined && stock !== null && Number(stock) <= 0;
});

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
  if (isOutOfStock.value) return;
  addToCart({
    id: String(props.product.id),
    name: props.product.name,
    price: props.product.price,
    image: props.product.image,
    stock: props.product.stock,
    slug: props.product.slug,
    categoryId: (props.product as any).categoryId || null,
  });

  addedState.value = true;
  setTimeout(() => {
    addedState.value = false;
  }, 1000);
};
</script>
