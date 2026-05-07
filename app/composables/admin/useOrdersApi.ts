import type { AdminOrderDetail, AdminOrderListItem, AdminOrderStatus } from '~/types/admin-order.type'

const mockOrders: AdminOrderListItem[] = [
  {
    id: 'ORD-1042',
    customerName: 'Nguyen Van An',
    customerEmail: 'an.nguyen@mail.com',
    items: 3,
    total: 128.5,
    paymentStatus: 'paid',
    orderStatus: 'confirmed',
    createdAt: 'May 6, 2026'
  },
  {
    id: 'ORD-1041',
    customerName: 'Tran Minh Thu',
    customerEmail: 'thu.tran@mail.com',
    items: 1,
    total: 64,
    paymentStatus: 'pending',
    orderStatus: 'preparing',
    createdAt: 'May 6, 2026'
  }
]

const mockOrderDetail: AdminOrderDetail = {
  id: 'ORD-1042',
  customerName: 'Nguyen Van An',
  customerEmail: 'an.nguyen@mail.com',
  customerPhone: '0901 223 445',
  shippingAddress: '128 Nguyen Trai, District 1, HCMC',
  paymentMethod: 'VNPay',
  paymentStatus: 'paid',
  orderStatus: 'confirmed',
  createdAt: 'May 6, 2026 09:32',
  items: [
    {
      id: 'PRD-1001',
      name: 'Organic Salmon Bowl',
      thumbnail: 'https://flowbite.com/docs/images/products/apple-watch.png',
      variant: 'Large / No spice',
      quantity: 2,
      unitPrice: 58.25
    },
    {
      id: 'PRD-1003',
      name: 'Healthy Granola Pack',
      thumbnail: 'https://flowbite.com/docs/images/products/apple-watch.png',
      variant: 'Default',
      quantity: 1,
      unitPrice: 12
    }
  ],
  summary: {
    subtotal: 128.5,
    shippingFee: 8,
    discount: 12,
    tax: 0,
    total: 124.5
  },
  timeline: [
    { status: 'pending', label: 'Pending', time: 'May 6, 2026 09:10' },
    { status: 'confirmed', label: 'Confirmed', time: 'May 6, 2026 09:20' },
    { status: 'preparing', label: 'Preparing', time: 'May 6, 2026 09:45' }
  ],
  notes: ''
}

export const useOrdersApi = (useMock = true) => {
  const { public: { apiBaseUrl } } = useRuntimeConfig()

  const listOrders = async () => {
    if (useMock) return { data: mockOrders, total: mockOrders.length }
    return await $fetch<{ data: AdminOrderListItem[]; total: number }>(`${apiBaseUrl}/v1/admin/orders`)
  }

  const getOrder = async (id: string) => {
    if (useMock) return { ...mockOrderDetail, id }
    return await $fetch<AdminOrderDetail>(`${apiBaseUrl}/v1/admin/orders/${id}`)
  }

  const updateOrderStatus = async (id: string, status: AdminOrderStatus, note: string) => {
    if (useMock) return { success: true }
    return await $fetch(`${apiBaseUrl}/v1/admin/orders/${id}/status`, {
      method: 'PUT',
      body: { status, note }
    })
  }

  return {
    listOrders,
    getOrder,
    updateOrderStatus
  }
}
