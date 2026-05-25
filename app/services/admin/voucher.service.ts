import {
  createAdminVoucherRequest,
  deleteAdminVoucherRequest,
  deleteAdminVouchersBulkRequest,
  getAdminVoucherDetailRequest,
  getAdminVouchersRequest,
  updateAdminVoucherBulkStatusRequest,
  updateAdminVoucherRequest,
} from '~/api/admin/voucherApi'
import type {
  AdminVoucher,
  AdminVoucherBulkDeletePayload,
  AdminVoucherBulkStatusPayload,
  AdminVoucherFormValues,
  AdminVoucherListResponse,
  AdminVoucherPayload,
  AdminVoucherQueryParams,
} from '~/types/voucher'

const normalizeText = (value: string) => value.trim()

const normalizeDateInput = (value: string | Date | null | undefined) => {
  if (!value) return ''
  const parsed = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(parsed.getTime())) return ''
  return parsed.toISOString().slice(0, 10)
}

const normalizeIds = (ids: string[]) => Array.from(new Set((ids || []).map((id) => String(id).trim()).filter(Boolean)))

const normalizeVoucherPayload = (form: AdminVoucherFormValues): AdminVoucherPayload => ({
  code: normalizeText(form.code).toUpperCase(),
  name: normalizeText(form.name),
  description: normalizeText(form.description || ''),
  type: form.type,
  discountValue: Number(form.discountValue || 0),
  maxDiscountAmount: form.maxDiscountAmount === null ? null : Number(form.maxDiscountAmount || 0),
  minOrderValue: Number(form.minOrderValue || 0),
  applyFor: form.applyFor,
  applyForIds: normalizeIds(form.applyForIds),
  startDate: normalizeDateInput(form.startDate),
  endDate: normalizeDateInput(form.endDate),
  status: form.status,
  quantity: Number(form.quantity || 0),
  usageLimitPerUser: Number(form.usageLimitPerUser || 1),
  isFeatured: Boolean(form.isFeatured),
})

const formatVoucherDateForInput = (value: string | Date | null | undefined) => normalizeDateInput(value)

const mapAdminVoucherToForm = (voucher: AdminVoucher | null): AdminVoucherFormValues => ({
  code: voucher?.code ?? '',
  name: voucher?.name ?? '',
  description: voucher?.description ?? '',
  type: voucher?.type ?? 'percent',
  discountValue: voucher?.discountValue ?? 0,
  maxDiscountAmount: voucher?.maxDiscountAmount ?? null,
  minOrderValue: voucher?.minOrderValue ?? 0,
  applyFor: voucher?.applyFor ?? 'all',
  applyForIds: Array.isArray(voucher?.applyForIds) ? voucher!.applyForIds.map(String) : [],
  startDate: formatVoucherDateForInput(voucher?.startDate),
  endDate: formatVoucherDateForInput(voucher?.endDate),
  status: voucher?.status ?? 'active',
  quantity: voucher?.quantity ?? 0,
  usageLimitPerUser: voucher?.usageLimitPerUser ?? 1,
  isFeatured: voucher?.isFeatured ?? false,
})

export const adminVoucherService = {
  getList: (params?: AdminVoucherQueryParams): Promise<AdminVoucherListResponse> =>
    getAdminVouchersRequest(params),

  getDetail: (id: string): Promise<AdminVoucher> =>
    getAdminVoucherDetailRequest(id),

  create: (form: AdminVoucherFormValues): Promise<AdminVoucher> =>
    createAdminVoucherRequest(normalizeVoucherPayload(form)),

  update: (id: string, form: AdminVoucherFormValues): Promise<AdminVoucher> =>
    updateAdminVoucherRequest(id, normalizeVoucherPayload(form)),

  delete: (id: string): Promise<AdminVoucher> =>
    deleteAdminVoucherRequest(id),

  bulkUpdateStatus: (payload: AdminVoucherBulkStatusPayload): Promise<{ updatedCount: number }> =>
    updateAdminVoucherBulkStatusRequest({
      voucher_ids: normalizeIds(payload.voucher_ids),
      status: payload.status,
    }),

  bulkDelete: (payload: AdminVoucherBulkDeletePayload): Promise<{ deletedCount: number }> =>
    deleteAdminVouchersBulkRequest({ voucher_ids: normalizeIds(payload.voucher_ids) }),

  buildCreatePayload: normalizeVoucherPayload,
  buildUpdatePayload: normalizeVoucherPayload,
  mapToForm: mapAdminVoucherToForm,
  formatDateForInput: formatVoucherDateForInput,
}