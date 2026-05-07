import type { AdminPaymentListItem, AdminPaymentStatus } from '~/types/admin-payment.type'

const mockPayments: AdminPaymentListItem[] = [
  {
    id: 'PAY-1001',
    orderId: 'ORD-1042',
    customer: 'Nguyen Van An',
    method: 'VNPay',
    amount: 124.5,
    status: 'completed',
    transactionId: 'TXN-923847',
    createdAt: 'May 6, 2026'
  },
  {
    id: 'PAY-1002',
    orderId: 'ORD-1041',
    customer: 'Tran Minh Thu',
    method: 'COD',
    amount: 64,
    status: 'pending',
    transactionId: '—',
    createdAt: 'May 6, 2026'
  }
]

export const usePaymentsApi = (useMock = true) => {
  const { public: { apiBaseUrl } } = useRuntimeConfig()

  const listPayments = async () => {
    if (useMock) return { data: mockPayments, total: mockPayments.length }
    return await $fetch<{ data: AdminPaymentListItem[]; total: number }>(`${apiBaseUrl}/v1/admin/payments`)
  }

  const refundPayment = async (id: string, reason: string, status: AdminPaymentStatus) => {
    if (useMock) return { success: true }
    return await $fetch(`${apiBaseUrl}/v1/admin/payments/${id}/refund`, {
      method: 'POST',
      body: { reason, status }
    })
  }

  return {
    listPayments,
    refundPayment
  }
}
