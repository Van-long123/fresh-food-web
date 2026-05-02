import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useDebounceFn } from '~/customHooks/useDebounceFn'
import { useProductsQuery } from '~/queries/product/useProductsQuery'
import type { ProductQueryParams } from '~/types/product.type'

export const useProductSearch = () => {
  const route = useRoute()

  // const selectedCategory = ref('')
  const currentPage = ref(1)
  const perPage = ref(30)
  
  // React to route query changes
  const routeKeyword = computed(() => (route.query.q as string) || '')
  const debouncedKeyword = ref(routeKeyword.value)

  // Debounce the update of the keyword parameter sent to the API
  const updateDebouncedKeyword = useDebounceFn((val: string) => {
    debouncedKeyword.value = val
  }, 500)

  watch(routeKeyword, (newVal) => {
    updateDebouncedKeyword(newVal)
    currentPage.value = 1
  })

  // Prepare parameters for API
  const queryParams = computed<ProductQueryParams>(() => {
    const params: ProductQueryParams = {
      page: currentPage.value,
      limit: perPage.value,
      keyword: debouncedKeyword.value
    }
    return params
  })

  // Fetch data
  const { data: rawData, isPending: isLoading, error } = useProductsQuery(queryParams)

  const formattedData = computed(() => {
    const resData = rawData.value
    const rawItems = resData?.data
    const pagination = resData?.pagination || { page: 1, limit: 30, total: 0, totalPages: 0 }

    if (!Array.isArray(rawItems)) return { data: [], pagination }

    const data = rawItems.map((item: any) => ({
      id: String(item._id || item.id || ''),
      name: String(item.title || item.name || ''),
      slug: String(item.slug || ''),
      image: String(item.thumbnail || item.image || ''),
      price: Number(item.price || 0),
      originalPrice: item.originalPrice ? Number(item.originalPrice) : null,
      discountPercent: item.discountPercentage ? Number(item.discountPercentage) : null,
      isBestPrice: Boolean(item.isBestPrice),
      isOnlineExclusive: Boolean(item.isOnlineExclusive),
      buttonText: String(item.buttonText || 'Mua')
    }))

    return { data, pagination }
  })

  const products = computed(() => formattedData.value.data)
  const pagination = computed(() => formattedData.value.pagination)

  // const toggleCategory = (name: string) => {
  //   selectedCategory.value = selectedCategory.value === name ? '' : name
  //   currentPage.value = 1
  // }

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return {
    routeKeyword,
    // selectedCategory,
    currentPage,
    perPage,
    isLoading,
    error,
    products,
    pagination,
    // toggleCategory,
    scrollToTop
  }
}
