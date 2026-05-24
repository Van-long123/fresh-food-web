import {
  getAdminProductsRequest,
  getAdminProductDetailRequest,
  createAdminProductRequest,
  updateAdminProductRequest,
  deleteAdminProductRequest,
  updateAdminProductBulkStatusRequest,
  deleteAdminProductsBulkRequest,
  getAdminCategoriesRequest
} from '~/api/admin/productApi'
import type {
  AdminProductQueryParams,
  AdminProduct,
  AdminProductListResponse,
  AdminCategoryListResponse
} from '~/types/product.type'
import { slugify } from '~/utils/formatters'

export const adminProductService = {
  getList: (params?: AdminProductQueryParams): Promise<AdminProductListResponse> =>
    getAdminProductsRequest(params),

  getDetail: (id: string): Promise<AdminProduct> =>
    getAdminProductDetailRequest(id),

  create: (payload: FormData): Promise<AdminProduct> =>
    createAdminProductRequest(payload),

  update: (id: string, payload: FormData | Record<string, any>): Promise<AdminProduct> =>
    updateAdminProductRequest(id, payload),

  delete: (id: string): Promise<AdminProduct> =>
    deleteAdminProductRequest(id),

  bulkUpdateStatus: (payload: { product_ids: string[]; status: 'active' | 'inactive' }): Promise<{ updatedCount: number }> =>
    updateAdminProductBulkStatusRequest(payload),

  bulkDelete: (payload: { product_ids: string[] }): Promise<{ deletedCount: number }> =>
    deleteAdminProductsBulkRequest(payload),

  getCategories: (params?: any): Promise<AdminCategoryListResponse> =>
    getAdminCategoriesRequest(params)
}

// ─── Shared types ─────────────────────────────────────────────────────────────

interface ProductFormData {
  title: string
  slug: string
  description: string
  thumbnail: string | File
  images: (string | File)[]
  stock: number
  unit: string
  price: number
  discountPercentage: number
  originalPrice: number
  status: 'active' | 'inactive'
  featured: boolean
  isBestPrice: boolean
  isOnlineExclusive: boolean
  tags: string[]
  position?: number | null
  primary_category_id: string
  category_ids: string[]
}

/**
 * Append một giá trị scalar vào FormData (bỏ qua null / undefined)
 */
const appendField = (fd: FormData, key: string, value: unknown) => {
  if (value === null || value === undefined) return
  fd.append(key, String(value))
}

/**
 * Build FormData cho Create Product API (multipart/form-data)
 * - File object → append với field name `thumbnail` / `images`
 * - String URL  → append bình thường (server bỏ qua nếu file được upload)
 */
export const buildCreateProductPayload = (form: ProductFormData): FormData => {
  const fd = new FormData()

  appendField(fd, 'title', form.title.trim())
  appendField(fd, 'slug', form.slug.trim() || slugify(form.title))
  appendField(fd, 'description', form.description || '')
  appendField(fd, 'stock', form.stock ?? 0)
  appendField(fd, 'unit', form.unit || 'kg')
  appendField(fd, 'price', form.price)
  appendField(fd, 'discountPercentage', form.discountPercentage ?? 0)
  appendField(fd, 'originalPrice', form.originalPrice ?? form.price)
  appendField(fd, 'status', form.status || 'active')
  appendField(fd, 'featured', String(form.featured ?? false))
  appendField(fd, 'isBestPrice', String(form.isBestPrice ?? false))
  appendField(fd, 'isOnlineExclusive', String(form.isOnlineExclusive ?? false))
  appendField(fd, 'primary_category_id', form.primary_category_id || '')

  if (form.position && form.position > 0) {
    appendField(fd, 'position', form.position)
  }

  // Tags: mảng → nhiều entry cùng key (multer sẽ parse thành mảng req.body.tags)
  ;(form.tags || []).forEach((tag) => fd.append('tags', tag))

  // Category IDs
  ;(form.category_ids || []).forEach((id) => fd.append('category_ids', id))

  // Thumbnail: File → multer field `thumbnail`, string → field `thumbnail_url`
  if (form.thumbnail instanceof File) {
    fd.append('thumbnail', form.thumbnail, form.thumbnail.name)
  } else if (typeof form.thumbnail === 'string' && form.thumbnail) {
    fd.append('thumbnail_url', form.thumbnail)
  }

  // Images: tách File và string URL
  ;(form.images || []).forEach((img) => {
    if (img instanceof File) {
      fd.append('images', img, img.name)
    } else if (typeof img === 'string' && img) {
      fd.append('images_url', img)
    }
  })

  return fd
}

/**
 * Build FormData cho Update Product API (multipart/form-data)
 * - File objects mới → field `thumbnail` / `images` (multer xử lý)
 * - String URL cũ   → field `images_url[]` (server giữ nguyên)
 */
export const buildUpdateProductPayload = (form: ProductFormData): FormData => {
  const fd = new FormData()

  appendField(fd, 'title', form.title.trim())
  appendField(fd, 'slug', form.slug.trim())
  appendField(fd, 'description', form.description || '')
  appendField(fd, 'stock', form.stock ?? 0)
  appendField(fd, 'unit', form.unit)
  appendField(fd, 'price', form.price)
  appendField(fd, 'discountPercentage', form.discountPercentage ?? 0)
  appendField(fd, 'originalPrice', form.originalPrice ?? form.price)
  appendField(fd, 'status', form.status)
  appendField(fd, 'featured', String(form.featured ?? false))
  appendField(fd, 'isBestPrice', String(form.isBestPrice ?? false))
  appendField(fd, 'isOnlineExclusive', String(form.isOnlineExclusive ?? false))
  appendField(fd, 'primary_category_id', form.primary_category_id || '')

  if (form.position !== null && form.position !== undefined) {
    appendField(fd, 'position', form.position)
  }

  ;(form.tags || []).forEach((tag) => fd.append('tags', tag))
  ;(form.category_ids || []).forEach((id) => fd.append('category_ids', id))

  // Thumbnail
  if (form.thumbnail instanceof File) {
    fd.append('thumbnail', form.thumbnail, form.thumbnail.name)
  } else if (typeof form.thumbnail === 'string' && form.thumbnail) {
    fd.append('thumbnail_url', form.thumbnail)
  }

  // Images
  ;(form.images || []).forEach((img) => {
    if (img instanceof File) {
      fd.append('images', img, img.name)
      console.log("🚀 ~ buildUpdateProductPayload ~ img:", img)
    } else if (typeof img === 'string' && img) {
      fd.append('images_url', img)
      console.log("🚀 ~ buildUpdateProductPayload ~ img:", img)
    }
  })

  return fd
}
