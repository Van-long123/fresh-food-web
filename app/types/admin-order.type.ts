export type AdminOrderStatus = 'pending' | 'confirmed' | 'preparing' | 'shipping' | 'delivered' | 'cancelled'
export type AdminPaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export interface AdminOrderListItem {
  id: string
  customerName: string
  customerEmail: string
  items: number
  total: number
  paymentStatus: AdminPaymentStatus
  orderStatus: AdminOrderStatus
  createdAt: string
}

export interface AdminOrderItem {
  id: string
  name: string
  thumbnail: string
  variant: string
  quantity: number
  unitPrice: number
}

export interface AdminOrderDetail {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: string
  paymentMethod: string
  paymentStatus: AdminPaymentStatus
  orderStatus: AdminOrderStatus
  createdAt: string
  items: AdminOrderItem[]
  summary: {
    subtotal: number
    shippingFee: number
    discount: number
    tax: number
    total: number
  }
  timeline: Array<{
    status: AdminOrderStatus
    label: string
    time: string
  }>
  notes: string
}
