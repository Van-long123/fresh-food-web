import type { AdminReviewStatus } from '~/types/admin-review.type'

export const validateReviewStatus = (status: AdminReviewStatus) => {
  const errors: Record<string, string> = {}
  if (!status) errors.status = 'Status is required'
  return errors
}
