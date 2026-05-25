import {
  bulkDeleteAdminCategoriesRequest,
  bulkUpdateAdminCategoryStatusRequest,
  createAdminCategoryRequest,
  deleteAdminCategoryRequest,
  getAdminCategoryDetailRequest,
  getAdminCategoriesRequest,
  updateAdminCategoryRequest
} from '~/api/admin/categoryApi'
import type {
  AdminCategory,
  AdminCategoryListResponse,
  AdminCategoryPayload,
  AdminCategoryQueryParams,
  CategoryFormData
} from '~/types/category.type'
import { slugify } from '~/utils/formatters'

const appendField = (fd: FormData, key: string, value: unknown) => {
  if (value === null || value === undefined) return
  fd.append(key, String(value))
}

const appendImageField = (fd: FormData, key: 'thumbnail' | 'bannerImage', value: string | File | undefined) => {
  if (value instanceof File) {
    fd.append(key, value, value.name)
    return
  }

  if (typeof value === 'string' && value) {
    appendField(fd, key, value)
  }
}

export const buildCreateCategoryPayload = (form: CategoryFormData): FormData => {
  const fd = new FormData()

  appendField(fd, 'title', form.title.trim())
  appendField(fd, 'slug', form.slug.trim() || slugify(form.title))
  appendField(fd, 'type', form.type)
  appendField(fd, 'description', form.description || '')
  appendField(fd, 'badgeText', form.badgeText || '')
  appendField(fd, 'status', form.status || 'active')
  appendField(fd, 'featured', String(form.featured ?? false))
  appendField(fd, 'position', form.position === '' ? null : form.position)
  appendField(fd, 'parent_id', form.parent_id === '' ? null : form.parent_id)
  appendImageField(fd, 'thumbnail', form.thumbnail)
  appendImageField(fd, 'bannerImage', form.bannerImage)

  return fd
}

export const buildUpdateCategoryPayload = (form: CategoryFormData): FormData => {
  const fd = new FormData()

  appendField(fd, 'title', form.title.trim())
  appendField(fd, 'slug', form.slug.trim() || slugify(form.title))
  appendField(fd, 'type', form.type)
  appendField(fd, 'description', form.description || '')
  appendField(fd, 'badgeText', form.badgeText || '')
  appendField(fd, 'status', form.status)
  appendField(fd, 'featured', String(form.featured ?? false))
  appendField(fd, 'position', form.position === '' ? null : form.position)
  appendField(fd, 'parent_id', form.parent_id === '' ? null : form.parent_id)
  appendImageField(fd, 'thumbnail', form.thumbnail)
  appendImageField(fd, 'bannerImage', form.bannerImage)

  return fd
}

export const adminCategoryService = {
  getList: (params?: AdminCategoryQueryParams): Promise<AdminCategoryListResponse> =>
    getAdminCategoriesRequest(params),

  getDetail: (id: string): Promise<AdminCategory> =>
    getAdminCategoryDetailRequest(id),

  create: (payload: FormData): Promise<AdminCategory> =>
    createAdminCategoryRequest(payload),

  update: (id: string, payload: FormData): Promise<AdminCategory> =>
    updateAdminCategoryRequest(id, payload),

  delete: (id: string): Promise<AdminCategory> =>
    deleteAdminCategoryRequest(id),

  bulkUpdateStatus: (payload: { category_ids: string[]; status: 'active' | 'inactive' }) =>
    bulkUpdateAdminCategoryStatusRequest(payload),

  bulkDelete: (payload: { category_ids: string[] }) =>
    bulkDeleteAdminCategoriesRequest(payload)
}