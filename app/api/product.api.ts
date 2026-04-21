import type { Product } from '~/types/product.type'

export const getProductsRequest = async (): Promise<Product[]> => {
  return []
}

export const getProductDetailRequest = async (_id: string | number): Promise<Product | null> => {
  return null
}
