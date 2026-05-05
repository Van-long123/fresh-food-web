import { computed, ref } from 'vue'
import { useVoucherListQuery } from '~/queries/voucher/useVoucherListQuery'
import type { SortKey, CouponType, CouponStatus, FilterTabKey, MappedCoupon } from '~/types/voucher'
import { formatExpireDate, formatExpireText, buildValueLabel } from '~/utils/formatters'


export const FILTER_TABS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'freeship', label: 'Freeship' },
  { key: 'percent', label: 'Giảm %' },
  { key: 'money', label: 'Giảm tiền' },
  // { key: 'product', label: 'Sản phẩm cụ thể' }
] as const


export const GUIDE_STEPS = [
  { id: 1, icon: '🔍', title: 'Tìm mã phù hợp', desc: 'Chọn mã có điều kiện khớp giỏ hàng hiện tại của bạn.' },
  { id: 2, icon: '📋', title: 'Sao chép mã', desc: 'Nhấn nút sao chép để lưu mã vào clipboard trong 1 chạm.' },
  { id: 3, icon: '🛒', title: 'Dán khi thanh toán', desc: 'Dán mã vào ô voucher ở bước checkout để nhận ưu đãi.' }
]

export const NOTE_ITEMS = [
  { title: 'Mỗi mã chỉ dùng được 1 lần/tài khoản', body: 'Sau khi áp dụng thành công, mã sẽ không thể sử dụng lại trên cùng tài khoản.' },
  { title: 'Không áp dụng đồng thời 2 mã giảm giá', body: 'Hệ thống chỉ ghi nhận một mã tối ưu nhất cho mỗi đơn hàng tại cùng thời điểm.' },
  { title: 'Mã có thể hết lượt trước ngày hết hạn', body: 'Một số mã giới hạn số lượt nên có thể dừng sớm khi đạt ngưỡng phát hành.' }
]

export const CONFETTI_SHAPES = Array.from({ length: 24 }).map((_, idx) => ({
  id: idx + 1,
  left: (idx * 13) % 100,
  top: (idx * 17) % 100,
  delay: (idx % 6) * 0.35,
  duration: 4 + (idx % 5) * 0.8,
  type: (['dot', 'diamond', 'star'] as const)[idx % 3],
  color: (['#ffffff', '#fde047', '#86efac'] as const)[idx % 3]
}))

// ─── Mappers (pure functions — utils-like) ─────────────────────────────────────

const TYPE_LABEL_MAP: Record<CouponType, string> = {
  money: 'GIẢM TIỀN',
  percent: 'GIẢM %',
  freeship: 'FREESHIP',
  product: 'SẢN PHẨM'
}

const TYPE_ICON_MAP: Record<CouponType, string> = {
  money: '💰',
  percent: '%',
  freeship: '🚚',
  product: '🛍️'
}


const buildCondition = (voucher: any): string => {
  const parts: string[] = []
  if (voucher.minOrderValue > 0) {
    parts.push(`Đơn tối thiểu ${voucher.minOrderValue.toLocaleString('vi-VN')}đ`)
  }
  if (voucher.maxDiscountAmount) {
    parts.push(`Tối đa ${voucher.maxDiscountAmount.toLocaleString('vi-VN')}đ`)
  }
  if (voucher.description) parts.push(voucher.description)
  return parts.join(' - ') || voucher.name
}

const resolveStatus = (voucher: any): CouponStatus => {
  const now = new Date()
  if (new Date(voucher.endDate) <= now) return 'expired'
  if (voucher.usedCount >= voucher.quantity) return 'expired'
  return 'active'
}

const mapVoucher = (v: any): MappedCoupon => {
  const type = v.type as CouponType
  return {
    id: String(v._id),
    code: v.code,
    type,
    typeLabel: TYPE_LABEL_MAP[type] ?? type.toUpperCase(),
    valueLabel: buildValueLabel(type, v.discountValue),
    condition: buildCondition(v),
    expireDate: formatExpireDate(v.endDate),
    expireText: formatExpireText(v.endDate),
    totalCount: v.quantity,
    usedCount: v.usedCount ?? 0,
    status: resolveStatus(v),
    featured: Boolean(v.isFeatured),
    updatedAt: v.updatedAt ? new Date(v.updatedAt) : null,
    createdAt: v.createdBy?.createdAt ? new Date(v.createdBy?.createdAt) : null,
    icon: TYPE_ICON_MAP[type] ?? '🎟️',
    amount: v.discountValue,
    endDate: v.endDate ? new Date(v.endDate) : null
  }
}


export const useVouchersPage = () => {
  const { data: vouchersData, isPending: isLoading } = useVoucherListQuery()

  // ── Reactive UI state ──
  const activeTab = ref<FilterTabKey>('all')
  const searchText = ref('')
  const sortKey = ref<SortKey>('best')
  const copiedCode = ref('')
  const burstCode = ref('')
  const openedNotes = ref(new Set<number>([0]))
  const progressVisible = ref(true)

  // ── Mapped data ──
  const allCoupons = computed<MappedCoupon[]>(() =>
    (vouchersData.value?.data || []).map(mapVoucher)
  )

  const featuredCoupons = computed(() => {
    return allCoupons.value.filter(c => c.featured && c.status === 'active').slice(0, 3);
  }
  )

  const maxDiscountPercent = computed(() => {
    const percents = allCoupons.value
      .filter(c => c.type === 'percent' && c.status === 'active')
      .map(c => c.amount)
    return percents.length ? Math.max(...percents) : 0
  })

  const freeshipsAvailable = computed(() =>
    allCoupons.value.some(c => c.type === 'freeship' && c.status === 'active')
  )

  const visibleCoupons = computed(() => {
    const query = searchText.value.trim().toLowerCase()
    let list = allCoupons.value.filter(coupon => {
      const matchTab = activeTab.value === 'all' || coupon.type === activeTab.value
      const matchSearch =
        !query ||
        coupon.code.toLowerCase().includes(query) ||
        coupon.condition.toLowerCase().includes(query) ||
        coupon.valueLabel.toLowerCase().includes(query)
      return matchTab && matchSearch
    })

    if (sortKey.value === 'best') {
      list = [...list].sort((a, b) => b.amount - a.amount)
    } else if (sortKey.value === 'latest') {
      list = [...list].sort((a, b) => {
        const aTime = a.updatedAt?.getTime() ?? 0
        const bTime = b.updatedAt?.getTime() ?? 0
        return bTime - aTime
      })
    } else if (sortKey.value === 'expiring') {
      list = [...list].sort((a, b) => {
        const aTime = a.endDate?.getTime() ?? Infinity
        const bTime = b.endDate?.getTime() ?? Infinity
        return aTime - bTime
      })
    }

    return list
  })

  const usagePercent = (coupon: MappedCoupon): number =>
    coupon.totalCount > 0 ? Math.round((coupon.usedCount / coupon.totalCount) * 100) : 0

  const toggleNote = (index: number) => {
    const next = new Set(openedNotes.value)
    if (next.has(index)) next.delete(index)
    else next.add(index)
    openedNotes.value = next
  }

  const copyCode = async (code: string) => {
    copiedCode.value = code
    burstCode.value = code
    try {
      await navigator.clipboard.writeText(code)
    } catch { /* Clipboard not supported — UI state still toggles */ }

    setTimeout(() => { burstCode.value = '' }, 500)
    setTimeout(() => { copiedCode.value = '' }, 1500)
  }

  return {
    // state
    activeTab,
    searchText,
    sortKey,
    copiedCode,
    burstCode,
    openedNotes,
    progressVisible,

    // computed
    isLoading,
    allCoupons,
    featuredCoupons,
    visibleCoupons,
    maxDiscountPercent,
    freeshipsAvailable,

    // static constants (no reactivity needed)
    filterTabs: FILTER_TABS,
    guideSteps: GUIDE_STEPS,
    noteItems: NOTE_ITEMS,
    confettiShapes: CONFETTI_SHAPES,

    // methods
    usagePercent,
    toggleNote,
    copyCode
  }
}
