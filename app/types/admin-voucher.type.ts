export type AdminVoucherType = 'money' | 'percent' | 'freeship' | 'product'
export type AdminVoucherStatus = 'active' | 'inactive' | 'expired'
export type AdminVoucherApplyFor = 'all' | 'category' | 'product'

export interface AdminVoucherListItem {
  id: string
  code: string
  name: string
  type: AdminVoucherType
  value: number
  usage: string
  expiresAt: string
  status: AdminVoucherStatus
}

export interface AdminVoucherForm {
  code: string
  name: string
  description: string
  type: AdminVoucherType
  discountValue: number
  maxDiscountAmount: number | null
  minOrderValue: number
  applyFor: AdminVoucherApplyFor
  applyForIds: string[]
  startDate: string
  endDate: string
  status: AdminVoucherStatus
  usageLimit: number
  usageLimitPerUser: number
  isFeatured: boolean
}
