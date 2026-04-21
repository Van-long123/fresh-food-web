<template>
  <div class="min-h-screen bg-gray-50 px-4 py-12">
    <div
      class="mx-auto max-w-xl rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
    >
      <h1 class="mb-2 text-2xl font-bold text-gray-900">Xác thực tài khoản</h1>
      <p class="mb-6 text-sm text-gray-600">
        Hệ thống đang xử lý xác thực email của bạn.
      </p>

      <div
        v-if="loading"
        class="rounded-lg bg-orange-50 p-4 text-sm text-orange-700"
      >
        Đang xác thực, vui lòng chờ trong giây lát...
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ROUTES } from "~/constants/routes";
import { useVerifyAccountMutation } from "~/mutations/user/useVerifyAccountMutation";

useHead({
  title: "Xác thực tài khoản - SmartFood",
  meta: [{ name: "description", content: "Xác thực tài khoản SmartFood" }],
});

const route = useRoute();
const router = useRouter();
const verifyAccountMutation = useVerifyAccountMutation();

const loading = ref(true);

onMounted(async () => {
  const email = String(route.query.email || "");
  const token = String(route.query.token || "");

  if (!email || !token) {
    await router.replace({
      path: ROUTES.AUTH.LOGIN,
      query: { verified: "false" },
    });
    return;
  }

  try {
    await verifyAccountMutation.mutateAsync({ email, token });
    await router.replace({
      path: ROUTES.AUTH.LOGIN,
      query: { verified: "true" },
    });
  } catch {
    await router.replace({
      path: ROUTES.AUTH.LOGIN,
      query: { verified: "false" },
    });
  } finally {
    loading.value = false;
  }
});
</script>
