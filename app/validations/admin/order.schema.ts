import type { AdminOrderStatus } from '~/types/admin-order.type'

export const validateOrderStatusUpdate = (status: AdminOrderStatus, note: string) => {
  const errors: Record<string, string> = {}

  if (!status) errors.status = 'Status is required'
  if (status === 'cancelled' && !note.trim()) errors.note = 'Reason is required for cancellation'

  return errors
}
