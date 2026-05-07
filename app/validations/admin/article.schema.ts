import type { AdminArticleForm } from '~/types/admin-article.type'

export const validateAdminArticle = (form: AdminArticleForm) => {
  const errors: Record<string, string> = {}

  if (!form.title.trim()) errors.title = 'Title is required'
  if (!form.slug.trim()) errors.slug = 'Slug is required'
  if (!form.shortDescription.trim()) errors.shortDescription = 'Short description is required'
  if (!form.content.trim()) errors.content = 'Content is required'
  if (!form.authorName.trim()) errors.authorName = 'Author name is required'
  if (!form.status) errors.status = 'Status is required'

  return errors
}
