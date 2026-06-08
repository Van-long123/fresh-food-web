<template>
  <div class="flex flex-col min-h-screen">
    <Header />
    <main class="flex-1">
      <slot />
    </main>
    <Footer />
    <!-- AI Chatbot — hiển thị trên tất cả trang client -->
    <SmartFoodChatbox />
  </div>
</template>
<script setup lang="ts">
import Header from "~/components/layout/Header.vue";
import Footer from "~/components/layout/Footer.vue";
import SmartFoodChatbox from "~/components/features/chat/SmartFoodChatbox.vue";
import { useSettingsStore } from "~/stores/useSettingsStore";

const settingsStore = useSettingsStore();

// Gọi API một lần duy nhất ở layout — Header, Footer, và các page con
// dùng store trực tiếp, không cần gọi API nữa.
await callOnce(() => settingsStore.fetchSettings());

// Cấu hình SEO động: tiêu đề dạng "Tên trang - WebsiteName"
useHead({
  titleTemplate: (title) =>
    title
      ? `${title} - ${settingsStore.websiteName}`
      : settingsStore.websiteName,
  meta: [
    {
      name: "description",
      content: `${settingsStore.websiteName} – Hệ thống bán lẻ thực phẩm an toàn, tươi ngon và tiết kiệm.`
    }
  ]
});
</script>
