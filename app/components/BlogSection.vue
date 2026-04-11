<template>
  <section
    class="bg-white rounded border border-gray-100 mb-10 overflow-hidden shadow-sm"
  >
    <!-- ── Header ── -->
    <div
      class="flex items-center justify-between px-5 py-4 border-b border-gray-100"
    >
      <h2 class="text-[19px] font-bold text-[#222] tracking-tight">
        Bạn Không Nên Bỏ Lỡ
      </h2>
      <NuxtLink
        :to="ROUTES.NEWS"
        class="flex items-center gap-1 text-[13px] font-semibold text-[#4caf50] hover:underline"
      >
        Xem tất cả
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </NuxtLink>
    </div>

    <!-- ── Body: 2 cột ── -->
    <div class="flex flex-col lg:flex-row gap-0">
      <!-- LEFT: Ảnh lớn + info -->
      <article
        class="w-full lg:w-[48%] p-4 lg:p-5 flex flex-col group cursor-pointer border-b lg:border-b-0 lg:border-r border-gray-100"
      >
        <!-- Ảnh -->
        <div class="w-full overflow-hidden rounded mb-3">
          <img
            :src="primaryPost.image"
            :alt="primaryPost.title"
            class="w-full aspect-[4/3] object-cover group-hover:scale-[1.02] transition-transform duration-500"
            loading="lazy"
          />
        </div>
        <!-- Title -->
        <h3
          class="text-[17px] font-semibold text-[#222] leading-snug mb-1.5 line-clamp-2 group-hover:text-[#4caf50] transition-colors"
        >
          {{ primaryPost.title }}
        </h3>
        <!-- Date -->
        <p class="text-[11px] text-gray-400 font-medium mb-2">
          {{ primaryPost.date }}
        </p>
        <!-- Description -->
        <p class="text-[13px] text-gray-600 leading-relaxed line-clamp-3">
          {{ primaryPost.description }}
          <span
            class="text-[#4caf50] font-medium ml-0.5 cursor-pointer hover:underline"
            >Đọc tiếp</span
          >
        </p>
      </article>

      <!-- RIGHT: Danh sách bài nhỏ có scroll -->
      <div
        class="w-full lg:w-[52%] overflow-y-auto max-h-[520px] lg:max-h-[560px] scrollbar-green"
      >
        <article
          v-for="(post, index) in secondaryPosts"
          :key="post.id"
          class="flex gap-3 px-4 py-3.5 group cursor-pointer hover:bg-gray-50 transition-colors"
          :class="{
            'border-b border-gray-100': index !== secondaryPosts.length - 1,
          }"
        >
          <!-- Thumbnail -->
          <div
            class="w-[100px] sm:w-[120px] h-[70px] sm:h-[82px] flex-shrink-0 overflow-hidden rounded bg-gray-100"
          >
            <img
              :src="post.image"
              :alt="post.title"
              class="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
              loading="lazy"
            />
          </div>

          <!-- Text -->
          <div class="flex flex-col flex-1 min-w-0 py-0.5">
            <h4
              class="text-[14px] sm:text-[15px] font-semibold text-[#222] leading-snug mb-1 line-clamp-2 group-hover:text-[#4caf50] transition-colors"
            >
              {{ post.title }}
            </h4>
            <p class="text-[11px] text-gray-400 font-medium mb-1.5">
              {{ post.date }}
            </p>
            <p
              class="text-[12.5px] text-gray-500 leading-relaxed line-clamp-2 hidden sm:block"
            >
              {{ post.description }}
              <span class="text-[#4caf50] font-medium ml-0.5 hover:underline"
                >Đọc tiếp</span
              >
            </p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { ROUTES } from '~/constants/routes'

const primaryPost = ref({
  id: 1,
  title:
    "Ưu Đãi Tuần Này Tại Organic Food – Mua Ngay Thực Phẩm Organic Giá Tốt",
  date: "Th 3 17/03/2026",
  description:
    "Ưu Đãi Tuần Này Tại Organic Food Có Gì Hấp Dẫn? Nếu các mom đang tìm một chương trình khuyến mãi thực phẩm organic để mua sắm...",
  image:
    "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800",
});

const secondaryPosts = ref([
  {
    id: 2,
    title:
      "Ưu Đãi Tuần Này Tại Organic Food – Mua Ngay Thực Phẩm Organic Giá Tốt",
    date: "Th 3 17/03/2026",
    description:
      "Ưu Đãi Tuần Này Tại Organic Food Có Gì Hấp Dẫn? Nếu các mom đang tìm một chương trình khuyến mãi thực phẩm organic để mua sắm...",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 3,
    title:
      "Khuyến Mãi Chà Bông Thịt Heo Chỉ 119.000đ/Hũ Từ 13/03 Đến 15/03/2026",
    date: "Th 6 13/03/2026",
    description:
      "Khuyến Mãi Chà Bông Thịt Heo Chỉ 119.000đ/Hũ Từ 13/03 Đến 15/03/2026. Nếu bạn đang tìm kiếm một sản phẩm tiện lợi, thơm ngon và phù hợp...",
    image:
      "https://images.unsplash.com/photo-1556910110-a5a63dfd393c?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 4,
    title: "Sale Promotion 2026",
    date: "Th 6 13/03/2026",
    description:
      "Khuyến Mãi Bí Đỏ Hạt Đậu Hữu Cơ Chỉ 79.000đ/kg Từ 13/03 Đến 15/03/2026. Nếu bạn đang tìm kiếm một loại rau củ hữu cơ thơm...",
    image:
      "https://images.unsplash.com/photo-1543362906-acfc16c67564?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 5,
    title:
      "Mua 1 Yến mạch hữu cơ Bob's Red Mill tặng 2 sữa đậu nành Kikkoman 200ml",
    date: "Th 4 11/03/2026",
    description:
      "Quà tặng hấp dẫn từ Bob's Red Mill: Mua 1 tặng 2 tại Organicfood.vn. Nếu bạn đang tìm một chương trình ưu đãi vừa tiết kiệm...",
    image:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 6,
    title: "CHÀO HÈ SẢNG KHOÁI – DEAL TẶNG BẠN",
    date: "Th 6 06/03/2026",
    description:
      "Mua 5 Tặng 1 áp dụng cho các sản phẩm thương hiệu Altavie tại Organicfood.vn. Mùa hè này, lên kệ ngay những món ăn vặt và...",
    image:
      "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: 7,
    title: "Vì sao Cô Kim Xuân chọn thực phẩm Organic?",
    date: "Th 5 05/03/2026",
    description:
      'Nhiều người thường thắc mắc: "Thực phẩm organic không dùng hóa chất thì đáng ra phải rẻ hơn chứ?" Nhưng thực tế, thực phẩm hữu cơ...',
    image:
      "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&q=80&w=400",
  },
]);
</script>

<style scoped>
/* Scrollbar xanh mỏng giống ảnh */
.scrollbar-green {
  scrollbar-width: thin;
  scrollbar-color: #4caf50 transparent;
}
.scrollbar-green::-webkit-scrollbar {
  width: 4px;
}
.scrollbar-green::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-green::-webkit-scrollbar-thumb {
  background-color: #4caf50;
  border-radius: 4px;
}
</style>
