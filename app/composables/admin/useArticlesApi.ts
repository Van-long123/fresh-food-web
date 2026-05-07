import type { AdminArticleForm, AdminArticleListItem } from '~/types/admin-article.type'

const mockArticles: AdminArticleListItem[] = [
  {
    id: 'ART-1001',
    title: 'Healthy Meal Prep Tips',
    category: 'Nutrition',
    author: 'Admin',
    status: 'active',
    publishedAt: 'May 6, 2026',
    thumbnail: 'https://flowbite.com/docs/images/blog/image-1.jpg'
  },
  {
    id: 'ART-1002',
    title: 'Top 10 Organic Ingredients',
    category: 'Guides',
    author: 'Editor',
    status: 'draft',
    publishedAt: '—',
    thumbnail: 'https://flowbite.com/docs/images/blog/image-2.jpg'
  }
]

export const useArticlesApi = (useMock = true) => {
  const { public: { apiBaseUrl } } = useRuntimeConfig()

  const listArticles = async () => {
    if (useMock) return { data: mockArticles, total: mockArticles.length }
    return await $fetch<{ data: AdminArticleListItem[]; total: number }>(`${apiBaseUrl}/v1/admin/articles`)
  }

  const getArticle = async (id: string) => {
    if (useMock) {
      const article = mockArticles.find((item) => item.id === id)
      if (!article) return null
      return {
        title: article.title,
        slug: article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        shortDescription: 'Short summary for article.',
        content: 'Full content goes here.',
        thumbnail: article.thumbnail,
        authorName: article.author,
        primaryCategoryId: null,
        tags: [],
        status: article.status,
        publishedAt: article.publishedAt === '—' ? null : article.publishedAt,
        metaTitle: article.title,
        metaDescription: 'SEO description.'
      } as AdminArticleForm
    }
    return await $fetch<AdminArticleForm>(`${apiBaseUrl}/v1/admin/articles/${id}`)
  }

  const createArticle = async (payload: AdminArticleForm) => {
    if (useMock) return { success: true }
    return await $fetch(`${apiBaseUrl}/v1/admin/articles`, { method: 'POST', body: payload })
  }

  const updateArticle = async (id: string, payload: AdminArticleForm) => {
    if (useMock) return { success: true }
    return await $fetch(`${apiBaseUrl}/v1/admin/articles/${id}`, { method: 'PUT', body: payload })
  }

  const deleteArticle = async (id: string) => {
    if (useMock) return { success: true }
    return await $fetch(`${apiBaseUrl}/v1/admin/articles/${id}`, { method: 'DELETE' })
  }

  return {
    listArticles,
    getArticle,
    createArticle,
    updateArticle,
    deleteArticle
  }
}
