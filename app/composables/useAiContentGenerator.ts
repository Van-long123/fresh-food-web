import { ref } from 'vue'
import { generateAiContentRequest } from '~/api/admin/aiContentApi'
import type { AiContentType, AiContentResult } from '~/types/aiContent.type'

/**
 * Composable tái sử dụng cho tính năng AI Content Generator.
 * Dùng ở trang create/edit của Product, Article, Category.
 */
export const useAiContentGenerator = () => {
  const isGenerating = ref(false)

  /**
   * Gọi API sinh nội dung AI và trả về kết quả
   * @param title - Tên sản phẩm / tiêu đề bài viết / tên danh mục
   * @param type - Loại nội dung cần sinh
   * @returns Kết quả từ AI hoặc null nếu lỗi
   */
  const generate = async (
    title: string,
    type: AiContentType
  ): Promise<AiContentResult | null> => {
    if (!title || !title.trim()) return null
    isGenerating.value = true
    try {
      return await generateAiContentRequest(title.trim(), type)
    } finally {
      isGenerating.value = false
    }
  }

  return { isGenerating, generate }
}
