export type SortKey = 'best' | 'latest' | 'expiring'

export type CouponType = 'freeship' | 'percent' | 'money' | 'product'

export type CouponStatus = 'active' | 'expired' | 'used'

export type FilterTabKey = 'all' | 'freeship' | 'percent' | 'money' | 'product'

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
