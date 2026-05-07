import { API_ENDPOINTS } from '~/constants/api'
import type { AdminProductForm, AdminProductListItem } from '~/types/admin-product.type'

const mockProducts: AdminProductListItem[] = [
  {
    id: 'PRD-1001',
    title: 'Organic Salmon Bowl',
    slug: 'organic-salmon-bowl',
    sku: 'SM-0342',
    category: 'Meal Box',
    price: 129000,
    stock: 64,
    status: 'active',
    thumbnail: 'https://flowbite.com/docs/images/products/apple-watch.png',
    updatedAt: 'May 6, 2026'
  },
  {
    id: 'PRD-1002',
    title: 'Fresh Avocado Salad',
    slug: 'fresh-avocado-salad',
    sku: 'FD-1120',
    category: 'Healthy Food',
    price: 89000,
    stock: 42,
    status: 'active',
    thumbnail: 'https://flowbite.com/docs/images/products/apple-watch.png',
    updatedAt: 'May 5, 2026'
  }
]

export const useProductsApi = (useMock = true) => {
  const { public: { apiBaseUrl } } = useRuntimeConfig()

  const listProducts = async () => {
    if (useMock) return { data: mockProducts, total: mockProducts.length }
    return await $fetch<{ data: AdminProductListItem[]; total: number }>(API_ENDPOINTS.PRODUCT.LIST)
  }

  const getProduct = async (id: string) => {
    if (useMock) return mockProducts.find((item) => item.id === id) || null
    return await $fetch<AdminProductForm>(`${apiBaseUrl}/v1/admin/products/${id}`)
  }

  const createProduct = async (payload: AdminProductForm) => {
    if (useMock) return { success: true }
    return await $fetch(`${apiBaseUrl}/v1/admin/products`, { method: 'POST', body: payload })
  }

  const updateProduct = async (id: string, payload: AdminProductForm) => {
    if (useMock) return { success: true }
    return await $fetch(`${apiBaseUrl}/v1/admin/products/${id}`, { method: 'PUT', body: payload })
  }

  const deleteProduct = async (id: string) => {
    if (useMock) return { success: true }
    return await $fetch(`${apiBaseUrl}/v1/admin/products/${id}`, { method: 'DELETE' })
  }

  return {
    listProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
  }
}
