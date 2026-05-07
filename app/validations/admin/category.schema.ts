import type { AdminCategoryForm } from '~/types/admin-category.type'

export const validateAdminCategory = (form: AdminCategoryForm) => {
  const errors: Record<string, string> = {}

  if (!form.title.trim()) errors.title = 'Name is required'
  if (!form.slug.trim()) errors.slug = 'Slug is required'
  if (form.position < 0) errors.position = 'Position cannot be negative'

  return errors
}
