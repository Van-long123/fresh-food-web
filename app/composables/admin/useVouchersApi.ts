import type { AdminVoucherForm, AdminVoucherListItem } from '~/types/admin-voucher.type'

const mockVouchers: AdminVoucherListItem[] = [
  {
    id: 'VCH-1001',
    code: 'FRESH20',
    name: 'Fresh Foods 20%',
    type: 'percent',
    value: 20,
    usage: '120/500',
    expiresAt: 'Jun 30, 2026',
    status: 'active'
  },
  {
    id: 'VCH-1002',
    code: 'SHIPFREE',
    name: 'Free Shipping',
    type: 'freeship',
    value: 0,
    usage: '58/200',
    expiresAt: 'May 30, 2026',
    status: 'active'
  }
]

export const useVouchersApi = (useMock = true) => {
  const { public: { apiBaseUrl } } = useRuntimeConfig()

  const listVouchers = async () => {
    if (useMock) return { data: mockVouchers, total: mockVouchers.length }
    return await $fetch<{ data: AdminVoucherListItem[]; total: number }>(`${apiBaseUrl}/v1/admin/vouchers`)
  }

  const getVoucher = async (id: string) => {
    if (useMock) {
      const voucher = mockVouchers.find((item) => item.id === id)
      if (!voucher) return null
      return {
        code: voucher.code,
        name: voucher.name,
        description: '',
        type: voucher.type,
        discountValue: voucher.value,
        maxDiscountAmount: null,
        minOrderValue: 0,
        applyFor: 'all',
        applyForIds: [],
        startDate: '',
        endDate: '',
        status: voucher.status,
        usageLimit: 100,
        usageLimitPerUser: 1,
        isFeatured: false
      }
    }
    return await $fetch<AdminVoucherForm>(`${apiBaseUrl}/v1/admin/vouchers/${id}`)
  }

  const createVoucher = async (payload: AdminVoucherForm) => {
    if (useMock) return { success: true }
    return await $fetch(`${apiBaseUrl}/v1/admin/vouchers`, { method: 'POST', body: payload })
  }

  const updateVoucher = async (id: string, payload: AdminVoucherForm) => {
    if (useMock) return { success: true }
    return await $fetch(`${apiBaseUrl}/v1/admin/vouchers/${id}`, { method: 'PUT', body: payload })
  }

  const deleteVoucher = async (id: string) => {
    if (useMock) return { success: true }
    return await $fetch(`${apiBaseUrl}/v1/admin/vouchers/${id}`, { method: 'DELETE' })
  }

  return {
    listVouchers,
    getVoucher,
    createVoucher,
    updateVoucher,
    deleteVoucher
  }
}
