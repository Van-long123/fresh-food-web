import type { AdminCategoryForm, AdminCategoryListItem } from '~/types/admin-category.type'

const mockCategories: AdminCategoryListItem[] = [
  {
    id: 'CAT-1001',
    title: 'Meal Box',
    slug: 'meal-box',
    parent: null,
    productCount: 120,
    status: 'active',
    position: 1,
    thumbnail: 'https://flowbite.com/docs/images/products/apple-watch.png'
  },
  {
    id: 'CAT-1002',
    title: 'Healthy Food',
    slug: 'healthy-food',
    parent: null,
    productCount: 88,
    status: 'active',
    position: 2,
    thumbnail: 'https://flowbite.com/docs/images/products/apple-watch.png'
  }
]

export const useCategoriesApi = (useMock = true) => {
  const { public: { apiBaseUrl } } = useRuntimeConfig()

  const listCategories = async () => {
    if (useMock) return { data: mockCategories, total: mockCategories.length }
    return await $fetch<{ data: AdminCategoryListItem[]; total: number }>(`${apiBaseUrl}/v1/admin/categories`)
  }

  const getCategory = async (id: string) => {
    if (useMock) return mockCategories.find((item) => item.id === id) || null
    return await $fetch<AdminCategoryForm>(`${apiBaseUrl}/v1/admin/categories/${id}`)
  }

  const createCategory = async (payload: AdminCategoryForm) => {
    if (useMock) return { success: true }
    return await $fetch(`${apiBaseUrl}/v1/admin/categories`, { method: 'POST', body: payload })
  }

  const updateCategory = async (id: string, payload: AdminCategoryForm) => {
    if (useMock) return { success: true }
    return await $fetch(`${apiBaseUrl}/v1/admin/categories/${id}`, { method: 'PUT', body: payload })
  }

  const deleteCategory = async (id: string) => {
    if (useMock) return { success: true }
    return await $fetch(`${apiBaseUrl}/v1/admin/categories/${id}`, { method: 'DELETE' })
  }

  return {
    listCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
  }
}
