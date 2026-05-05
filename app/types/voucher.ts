export type SortKey = 'best' | 'latest' | 'expiring'

export type CouponType = 'freeship' | 'percent' | 'money' | 'product'
export type VoucherScope = 'all' | 'category' | 'product'

export type CouponStatus = 'active' | 'expired' | 'used'

export type FilterTabKey = 'all' | 'freeship' | 'percent' | 'money' | 'product'

export interface VoucherValidationItem {
  productId: string
  categoryId?: string | null
  quantity: number
  price: number
}

export interface ValidatedVoucher {
  _id: string
  code: string
  name: string
  type: CouponType
  discountValue: number
  maxDiscountAmount: number | null
  minOrderValue: number
  applyFor: VoucherScope
  applyForIds: string[]
}

export interface VoucherValidationResponse {
  isValid: boolean
  discountAmount: number
  eligibleSubtotal: number
  discountBreakdown: Record<string, number>
  voucher: ValidatedVoucher
}

export interface MappedCoupon {
  id: string
  code: string
  type: CouponType
  typeLabel: string
  valueLabel: string
  condition: string
  expireDate: string
  expireText: string
  totalCount: number
  usedCount: number
  status: CouponStatus
  featured: boolean
  updatedAt: Date | null
  createdAt: Date | null
  icon: string
  amount: number
  endDate: Date | null
}
