import { getCategoryProductsRequest } from '~/api/client/category.api'
import type {
  CategoryProductsApiResponse,
  CategoryProductsQueryParams
} from '~/types/category-products.type'

export const categoryService = {
  getProducts: (slug: string, params: CategoryProductsQueryParams): Promise<CategoryProductsApiResponse> =>
    getCategoryProductsRequest(slug, params)
}
