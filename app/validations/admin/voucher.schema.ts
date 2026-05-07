import type { AdminVoucherForm } from '~/types/admin-voucher.type'

export const validateAdminVoucher = (form: AdminVoucherForm) => {
  const errors: Record<string, string> = {}

  if (!form.code.trim()) errors.code = 'Code is required'
  if (!form.name.trim()) errors.name = 'Name is required'
  if (form.discountValue <= 0) errors.discountValue = 'Value must be greater than 0'
  if (!form.startDate) errors.startDate = 'Start date is required'
  if (!form.endDate) errors.endDate = 'End date is required'
  if (form.usageLimit < 0) errors.usageLimit = 'Usage limit cannot be negative'

  return errors
}
