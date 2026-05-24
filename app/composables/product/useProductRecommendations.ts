import { computed, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { getProductRecommendationsRequest } from '~/api/client/product.api'
import type { HomeProduct } from '~/types/home.type'
import type { ProductRecommendationItem } from '~/types/product.type'

/**
 * Maps a raw recommendation item from the Python microservice
 * into the HomeProduct shape used by <ProductCard />.
 */
const mapRecommendationToHomeProduct = (item: ProductRecommendationItem): HomeProduct => ({
  id: item._id,
  slug: item.slug || '',
  name: item.title,
  // Python service returns images[], use first as card image
  image: item.images?.[0] || '',
  price: item.price,
  originalPrice: null,
  discountPercent: null,
  isBestPrice: item.isBestPrice,
  isOnlineExclusive: item.isOnlineExclusive,
  stock: 1, // recommendations only include in-stock products
  buttonText: 'Mua'
})

/**
 * Fetches AI-powered product recommendations for a given product _id.
 *
 * Usage in [slug].vue:
 *   const { recommendations, isLoadingRecommendations } =
 *     useProductRecommendations(productId, { limit: 8 })
 */
export const useProductRecommendations = (
  productId: Ref<string>,
  options?: { limit?: number; categoryBoost?: boolean }
) => {
  const limit = options?.limit ?? 8
  const categoryBoost = options?.categoryBoost ?? true

  const enabled = computed(() => Boolean(productId.value))

  const query = useQuery({
    queryKey: computed(() => ['product-recommendations', productId.value, limit]),
    enabled,
    queryFn: () =>
      getProductRecommendationsRequest(productId.value, {
        limit,
        category_boost: categoryBoost
      }),
    // Do not retry on 404 (product not in active catalogue)
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) return false
      return failureCount < 2
    },
    staleTime: 5 * 60 * 1000 // 5 min — recommendations don't change frequently
  })

  const recommendations = computed<HomeProduct[]>(() => {
    const items = query.data.value?.recommendations ?? []
    return items.map(mapRecommendationToHomeProduct)
  })

  return {
    recommendations,
    isLoadingRecommendations: query.isLoading,
    isErrorRecommendations: query.isError
  }
}
