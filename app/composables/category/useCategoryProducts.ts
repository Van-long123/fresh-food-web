import { computed, ref, unref, type Ref } from 'vue'
import { categoryService } from '~/services/category.service'
import type {
  CategoryProduct,
  CategoryProductsFilter,
  CategoryProductsQueryParams,
  CategoryProductsSortBy,
  CategorySummary,
  RelatedCategory
} from '~/types/category-products.type'

type MaybeRef<T> = T | Ref<T>

const normalizeSlug = (value: unknown): string => {
  if (typeof value !== 'string') return ''
  return value.trim()
}

const toBrandsParam = (brands: string[]): string[] | undefined => {
  const normalized = brands.map((b) => String(b || '').trim()).filter(Boolean)
  return normalized.length ? normalized : undefined
}

export const useCategoryProducts = (slug: MaybeRef<string>) => {
  const category = ref<CategorySummary | null>(null)
  const products = ref<CategoryProduct[]>([])

  const priceStats = ref({ minPrice: 0, maxPrice: 0 })
  const pagination = ref({ page: 1, limit: 10, total: 0, totalPages: 0 })

  const activeFilter = ref<CategoryProductsFilter>('all')
  const sortBy = ref<CategoryProductsSortBy>('popular')
  const minPrice = ref(0)
  const maxPrice = ref(0)
  const selectedBrands = ref<string[]>([])

  const isLoading = ref(true)
  const isSystemUpdatingPrice = ref(false)
  // const isLoadingMore = ref(false)
  const isError = ref(false)
  const errorMessage = ref('')

  const currentSlug = computed(() => normalizeSlug(unref(slug)))

  // const hasMore = computed(() => {
  // const page = pagination.value.page
  // const totalPages = pagination.value.totalPages
  // if (!totalPages) return false
  // return page < totalPages
  // })

  const normalizePriceRange = () => {
    const currentMin = Math.min(minPrice.value, maxPrice.value)
    const currentMax = Math.max(minPrice.value, maxPrice.value)

    return { currentMin, currentMax }
  }

  const buildBaseParams = (): Omit<CategoryProductsQueryParams, 'page'> => {
    const { currentMin, currentMax } = normalizePriceRange()

    const base: Omit<CategoryProductsQueryParams, 'page'> = {
      limit: pagination.value.limit,
      filter: activeFilter.value,
      sortBy: sortBy.value
    }

    if (currentMin > 0) base.minPrice = currentMin
    if (currentMax > 0) base.maxPrice = currentMax

    const brands = toBrandsParam(selectedBrands.value)
    if (brands) base.brands = brands

    return base
  }

  let requestSeq = 0
  let lastQuerySignature = ''

  const applyInitialPriceRange = (stats: { minPrice: number; maxPrice: number }) => {
    isSystemUpdatingPrice.value = true
    const hasUserRange = minPrice.value > 0 || maxPrice.value > 0

    priceStats.value = {
      minPrice: Number(stats?.minPrice || 0),
      maxPrice: Number(stats?.maxPrice || 0)
    }

    if (!hasUserRange) {
      minPrice.value = priceStats.value.minPrice
      maxPrice.value = priceStats.value.maxPrice
    } else {
      // Clamp nếu user đang set ngoài range thực tế
      if (priceStats.value.minPrice && minPrice.value < priceStats.value.minPrice) {
        minPrice.value = priceStats.value.minPrice
      }
      if (priceStats.value.maxPrice && maxPrice.value > priceStats.value.maxPrice) {
        maxPrice.value = priceStats.value.maxPrice
      }
    }

    setTimeout(() => {
      isSystemUpdatingPrice.value = false
    }, 0)
  }

  const fetchPage = async (page: number = 1): Promise<void> => {
    const slugValue = currentSlug.value
    if (!slugValue) return

    const seq = ++requestSeq
    isLoading.value = true
    isError.value = false
    errorMessage.value = ''

    const baseParams = buildBaseParams()
    const signature = JSON.stringify({ slug: slugValue, ...baseParams, page })
    lastQuerySignature = signature

    try {
      const response = await categoryService.getProducts(slugValue, {
        ...baseParams,
        page
      })

      if (seq !== requestSeq) return

      category.value = response.category
      products.value = Array.isArray(response.products) ? response.products : []
      pagination.value = response.pagination

      applyInitialPriceRange(response.priceStats)
      
      // Scroll to top of product list after page change
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } catch (error) {
      if (seq !== requestSeq) return

      isError.value = true
      errorMessage.value =
        error instanceof Error && error.message
          ? error.message
          : 'Không thể tải sản phẩm theo danh mục.'
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

  // const fetchNextPage = async (): Promise<void> => {
  // if (isLoading.value || isLoadingMore.value) return
  // if (!hasMore.value) return

  // const slugValue = currentSlug.value
  // if (!slugValue) return

  // const baseParams = buildBaseParams()
  // const signature = JSON.stringify({ slug: slugValue, ...baseParams })

  // // Nếu filter/sort/price đã thay đổi trong lúc scroll, bỏ qua fetchMore.
  // if (signature !== lastQuerySignature) return

  // isLoadingMore.value = true

  // const nextPage = pagination.value.page + 1

  // try {
  // const response = await categoryService.getProducts(slugValue, {
  // ...baseParams,
  // page: nextPage
  // })

  // // Nếu query signature đổi trong lúc đợi API, không append.
  // const updatedSignature = JSON.stringify({ slug: slugValue, ...buildBaseParams() })
  // if (updatedSignature !== lastQuerySignature) return

  // const nextProducts = Array.isArray(response.products) ? response.products : []
  // products.value = [...products.value, ...nextProducts]
  // pagination.value = response.pagination

  // // Không reset range khi load-more.
  // priceStats.value = {
  // minPrice: Number(response.priceStats?.minPrice || priceStats.value.minPrice),
  // maxPrice: Number(response.priceStats?.maxPrice || priceStats.value.maxPrice)
  // }
  // } catch {
  // // Load more lỗi thì im lặng (toast đã hiển thị từ authorizedAxios)
  // } finally {
  // isLoadingMore.value = false
  // }
  // }

  const resetFilters = () => {
    activeFilter.value = 'all'
    sortBy.value = 'popular'
    selectedBrands.value = []

    minPrice.value = priceStats.value.minPrice
    maxPrice.value = priceStats.value.maxPrice
  }

  const setPageSize = (value: number) => {
    const next = Number(value)
    if (!Number.isFinite(next) || next <= 0) return
    pagination.value = { ...pagination.value, limit: next }
  }

  return {
    category,
    products,
    pagination,
    priceStats,
    activeFilter,
    sortBy,
    minPrice,
    maxPrice,
    selectedBrands,
    // hasMore,
    isLoading,
    isSystemUpdatingPrice,
    // isLoadingMore,
    isError,
    errorMessage,
    setPageSize,
    fetchPage,
    handlePageChange,
    resetFilters
  }
}
