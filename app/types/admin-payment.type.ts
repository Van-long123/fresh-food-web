export type AdminPaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'

export interface AdminPaymentListItem {
  id: string
  orderId: string
  customer: string
  method: string
  amount: number
  status: AdminPaymentStatus
  transactionId: string
  createdAt: string
}
