import type { AdminPaymentStatus } from '~/types/admin-payment.type'

export const validateRefund = (status: AdminPaymentStatus, reason: string) => {
  const errors: Record<string, string> = {}
  if (status !== 'completed') errors.status = 'Only completed payments can be refunded'
  if (!reason.trim()) errors.reason = 'Refund reason is required'
  return errors
}
