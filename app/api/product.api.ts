import { API_ENDPOINTS } from '~/constants/api'
import type { Product, ProductDetailResponse } from '~/types/product.type'
import { getAuthorizedAxios } from '~/utils/authorizedAxios'

export const getProductsRequest = async (): Promise<Product[]> => {
  const response = await getAuthorizedAxios().get(API_ENDPOINTS.PRODUCT.LIST)
  const rawData = response.data?.data
  if (!Array.isArray(rawData)) return []

  return rawData.map((item: Record<string, unknown>) => ({
    id: String(item._id || item.id || ''),
    name: String(item.title || item.name || ''),
    slug: String(item.slug || ''),
    image: String(item.thumbnail || item.image || ''),
    price: Number(item.price || 0),
    originalPrice: item.originalPrice ? Number(item.originalPrice) : null,
    discountPercent: item.discountPercentage ? Number(item.discountPercentage) : null
  }))
}

export const getProductDetailRequest = async (slug: string): Promise<ProductDetailResponse | null> => {
  const response = await getAuthorizedAxios().get(API_ENDPOINTS.PRODUCT.DETAIL(slug))
  return (response.data || null) as ProductDetailResponse | null
}
