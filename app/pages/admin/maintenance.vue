<script setup lang="ts">
import { ROUTES } from "~/constants/routes";
definePageMeta({
  layout: false,
  middleware: ["auth", "admin"],
});
</script>

<template>
  <div
    class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 dark:bg-gray-900"
  >
    <div
      class="block mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
    >
      <span class="self-center text-2xl font-bold whitespace-nowrap uppercase"
        >SmartFood</span
      >
    </div>
    <div
      class="w-full p-6 bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-700 sm:p-8 text-center"
    >
      <svg
        class="w-24 h-24 mx-auto mb-6 text-primary-600"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fill-rule="evenodd"
          d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
          clip-rule="evenodd"
        ></path>
      </svg>
      <h1
        class="mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl dark:text-white"
      >
        Under Maintenance
      </h1>
      <p class="mb-8 text-lg font-light text-gray-500 dark:text-gray-400">
        Sorry for the inconvenience but we're performing some maintenance at the
        moment. If you need to you can always
        <a
          href="#"
          class="font-medium text-primary-600 hover:underline dark:text-primary-500"
          >contact us</a
        >, otherwise we'll be back online shortly!
      </p>
      <NuxtLink
        :to="ROUTES.ADMIN.DASHBOARD"
        class="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
      >
        <svg class="mr-2 -ml-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clip-rule="evenodd"
          ></path>
        </svg>
        Go back home
      </NuxtLink>
    </div>
  </div>
</template>
