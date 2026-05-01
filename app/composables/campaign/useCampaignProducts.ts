import { computed, ref, unref, type Ref } from 'vue'
import { homeService } from '~/services/home.service'
import type {
  CategoryProduct
} from '~/types/category-products.type'

type MaybeRef<T> = T | Ref<T>

const normalizeSlug = (value: unknown): string => {
  if (typeof value !== 'string') return ''
  return value.trim()
}

export const useCampaignProducts = (slug: MaybeRef<string>) => {
  const campaign = ref<{ id: string, slug: string, name: string } | null>(null)
  const products = ref<CategoryProduct[]>([])

  const pagination = ref({ page: 1, limit: 10, total: 0, totalPages: 0 })

  const isLoading = ref(true)
  const isError = ref(false)
  const errorMessage = ref('')

  const currentSlug = computed(() => normalizeSlug(unref(slug)))

  let requestSeq = 0

  const fetchPage = async (page: number = 1): Promise<void> => {
    const slugValue = currentSlug.value
    if (!slugValue) return

    const seq = ++requestSeq
    isLoading.value = true
    isError.value = false
    errorMessage.value = ''

    try {
      const response = await homeService.getCampaignProducts(slugValue, {
        limit: pagination.value.limit,
        page
      })

      if (seq !== requestSeq) return

      campaign.value = response.campaign
      products.value = Array.isArray(response.data) ? response.data : []
      pagination.value = {
        ...pagination.value,
        page,
        total: response.total || 0,
        totalPages: Math.ceil((response.total || 0) / pagination.value.limit)
      }
      
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } catch (error) {
      if (seq !== requestSeq) return

      isError.value = true
      errorMessage.value =
        error instanceof Error && error.message
          ? error.message
          : 'Không thể tải sản phẩm chiến dịch.'
    } finally {
      if (seq === requestSeq) {
        isLoading.value = false
      }
    }
  }

  const handlePageChange = async (newPage: number) => {
    if (newPage === pagination.value.page) return
    await fetchPage(newPage)
  }

  const setPageSize = (value: number) => {
    const next = Number(value)
    if (!Number.isFinite(next) || next <= 0) return
    pagination.value = { ...pagination.value, limit: next }
  }

  return {
    campaign,
    products,
    pagination,
    isLoading,
    isError,
    errorMessage,
    setPageSize,
    fetchPage,
    handlePageChange,
  }
}
