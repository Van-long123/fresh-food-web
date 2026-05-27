<script setup lang="ts">
import { computed } from "vue";
import Editor from "@tinymce/tinymce-vue";
import { API_ENDPOINTS } from "~/constants/api";
import { getAuthorizedAxios } from "~/utils/authorizedAxios";

const props = defineProps<{
  modelValue: string;
  placeholder?: string;
  height?: number;
}>();

const emit = defineEmits<{
  "update:modelValue": [string];
}>();

const handleUpdate = (value: string) => {
  emit("update:modelValue", value);
};

const editorInit = computed(() => ({
  height: props.height ?? 420,
  // menubar: false, branding: false (ẩn logo TinyMCE).
  menubar: false,
  branding: false,
  placeholder: props.placeholder || "Nhập nội dung tại đây...",
  plugins: ["lists", "link", "image", "code", "table", "autolink", "preview"],
  toolbar:
    "undo redo | blocks | bold italic underline | alignleft aligncenter alignright | " +
    "bullist numlist | link image | table | code preview",
  content_style:
    "body { font-family: 'Inter', sans-serif; font-size: 14px; color: #0f172a; }",
  automatic_uploads: true,
  paste_data_images: false,
  images_reuse_filename: true,
  // blobInfo: Chứa dữ liệu của bức ảnh
  images_upload_handler: (blobInfo: any, progress: (percent: number) => void) =>
    new Promise<string>((resolve, reject) => {
      const formData = new FormData();
      formData.append("file", blobInfo.blob(), blobInfo.filename());

      getAuthorizedAxios()
        .post(API_ENDPOINTS.UPLOAD.EDITOR_IMAGE, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          // Đây là chức năng của Axios. Trong lúc đang đẩy file lên mạng, nó sẽ liên tục gọi hàm onUploadProgress
          onUploadProgress: (event) => {
            if (!event.total) return;
            // vẽ thanh loading báo cho người dùng biết.
            progress(Math.round((event.loaded / event.total) * 100));
          },
        })
        .then((response) => {
          const location = response.data?.location;

          if (!location) {
            reject(new Error("Upload failed"));
            return;
          }

          resolve(location);
        })
        .catch((error) => {
          // TinyMCE sẽ hủy thao tác chèn ảnh và báo lỗi trên giao diện.
          reject(error);
        });
    }),
}));
</script>

<template>
  <div
    class="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700"
  >
    <div
      class="flex items-center gap-2 bg-gray-50 px-3 py-2 text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400"
    >
      <span class="font-medium">Trình soạn thảo</span>
      <span class="text-gray-400">TinyMCE Editor</span>
    </div>
    <!-- Thẻ <ClientOnly>: Vì ứng dụng của bạn dùng Nuxt 3 (chạy SSR - Server Side Rendering), mà thư viện TinyMCE thì bắt buộc phải chạy trên Trình duyệt (vì nó cần tới biến window, document).
      Thẻ <ClientOnly> báo cho Nuxt biết: "Chỉ render component bên trong này khi code đã chạy ở phía Client (trình duyệt), đừng render nó trên Server". -->
    <ClientOnly>
      <Editor
        :model-value="modelValue"
        @update:model-value="handleUpdate"
        :init="editorInit"
        api-key="ldyj1by5p9dv1th9tp5s18z957926kxqcyw9i9abl3xz5a1d"
        tinymce-script-src="https://cdn.tiny.cloud/1/ldyj1by5p9dv1th9tp5s18z957926kxqcyw9i9abl3xz5a1d/tinymce/6/tinymce.min.js"
      />
    </ClientOnly>
  </div>
</template>
