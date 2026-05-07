import type { AdminProductForm } from '~/types/admin-product.type'

export const validateAdminProduct = (form: AdminProductForm) => {
  const errors: Record<string, string> = {}

  if (!form.title.trim()) errors.title = 'Title is required'
  if (!form.slug.trim()) errors.slug = 'Slug is required'
  if (!form.sku.trim()) errors.sku = 'SKU is required'
  if (!form.categories.length) errors.categories = 'Select at least one category'
  if (form.price <= 0) errors.price = 'Price must be greater than 0'
  if (form.salePrice !== null && form.salePrice < 0) errors.salePrice = 'Sale price cannot be negative'
  if (form.stock < 0) errors.stock = 'Stock cannot be negative'
  if (!form.shortDescription.trim()) errors.shortDescription = 'Short description is required'

  return errors
}
