import type { AdminReviewListItem, AdminReviewStatus } from '~/types/admin-review.type'

const mockReviews: AdminReviewListItem[] = [
  {
    id: 'REV-1001',
    product: 'Organic Salmon Bowl',
    user: 'Nguyen Van An',
    rating: 5,
    comment: 'Great taste and portion size. Will order again!',
    status: 'pending',
    createdAt: 'May 6, 2026'
  },
  {
    id: 'REV-1002',
    product: 'Fresh Avocado Salad',
    user: 'Tran Minh Thu',
    rating: 4,
    comment: 'Fresh ingredients, a bit light on dressing.',
    status: 'approved',
    createdAt: 'May 5, 2026'
  }
]

export const useReviewsApi = (useMock = true) => {
  const { public: { apiBaseUrl } } = useRuntimeConfig()

  const listReviews = async () => {
    if (useMock) return { data: mockReviews, total: mockReviews.length }
    return await $fetch<{ data: AdminReviewListItem[]; total: number }>(`${apiBaseUrl}/v1/admin/reviews`)
  }

  const updateReviewStatus = async (id: string, status: AdminReviewStatus) => {
    if (useMock) return { success: true }
    return await $fetch(`${apiBaseUrl}/v1/admin/reviews/${id}/status`, {
      method: 'PUT',
      body: { status }
    })
  }

  const deleteReview = async (id: string) => {
    if (useMock) return { success: true }
    return await $fetch(`${apiBaseUrl}/v1/admin/reviews/${id}`, { method: 'DELETE' })
  }

  return {
    listReviews,
    updateReviewStatus,
    deleteReview
  }
}
