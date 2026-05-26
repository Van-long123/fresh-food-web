//  CLIENT-SIDE TYPES
export interface OrderProduct {
  id: string | number
  title: string
  thumbnail: string
  quantity: number
  totalPrice: number
  priceNew?: number
  categoryId?: string | null
}

export interface CartDetail {
  products: OrderProduct[]
  totalPrice: number
}

export interface Product {
  id: string | number
  title: string
  thumbnail: string
  priceNew: number
  slug?: string
}

export interface Voucher {
  id: string | number
  code: string
  title: string
  detail: string
  discountPercent?: number
  discountAmount?: number
  minOrderValue: number
  maxDiscountAmount?: number
  usedCount: number
  totalCount: number
  expiryDate?: string
}

/** Thông tin giao hàng của khách (dùng chung client & admin) */
export interface UserInfo {
  fullname: string
  phone: string
  address: string
  ward: string
  district: string
  province: string
  note?: string
}

export interface OrderInfo {
  userInfo: UserInfo
  products: OrderProduct[]
  deliveryMethod: number
  paymentMethod: number
  voucherCode?: string
  discountVoucher: number
  shippingFee: number
  totalPrice: number
}

export interface CheckoutData {
  products: OrderProduct[]
  voucherCode?: string
  voucherType?: string | null
  discountVoucher: number
  shippingFee: number
  subtotal: number
  grandTotal: number
}

export interface OrderPayload {
  userInfo: UserInfo
  products: OrderProduct[]
  deliveryMethod: number
  paymentMethod: number
  voucherCode?: string
  discountVoucher: number
  shippingFee: number
  totalPrice: number
}

export interface MyOrder {
  _id: string
  code: string
  status: string
  totalPrice: number
  createdAt: string | number
  paymentMethod: number
  paymentStatus: string
  items: Array<{
    productId: string
    title: string
    thumbnail: string
    quantity: number
    price: number
    totalPrice: number
  }>
}

//  ADMIN-SIDE TYPES
// ── Order Statuses 
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipping'
  | 'delivered'
  | 'cancelled'
  | 'returned'

// ── Payment Statuses 
export type PaymentStatus = 'pending' | 'completed' | 'cancelled'

// ── Payment Methods ──
export type PaymentMethod = 'COD' | 'PayOS'

/**
 * Luồng chuyển trạng thái hợp lệ (dùng trong cả list inline-edit & detail page).
 * Key → mảng các bước tiếp theo có thể chọn (label + value).
 */
export const NEXT_STATUS_MAP: Record<OrderStatus, Array<{ value: OrderStatus; label: string }>> = {
  pending: [
    { value: 'confirmed', label: '✅ Xác nhận đơn' },
    { value: 'cancelled', label: '❌ Hủy đơn' },
  ],
  confirmed: [
    { value: 'processing', label: '⚙️ Bắt đầu xử lý' },
    { value: 'cancelled', label: '❌ Hủy đơn' },
  ],
  processing: [
    { value: 'shipping', label: '🚚 Gửi hàng' },
    { value: 'cancelled', label: '❌ Hủy đơn' },
  ],
  shipping: [{ value: 'delivered', label: '✔️ Xác nhận đã giao' }],
  delivered: [{ value: 'returned', label: '↩️ Khách trả hàng' }],
  cancelled: [],
  returned: [],
}

/**
 * Dạng rút gọn: chỉ giá trị string — dùng cho filter trong danh sách (inline-edit select).
 */
export const NEXT_STATUS_VALUES: Record<OrderStatus, OrderStatus[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['shipping', 'cancelled'],
  shipping: ['delivered'],
  delivered: ['returned'],
  cancelled: [],
  returned: [],
}

/** Tất cả trạng thái đơn hàng (label + value) cho select/filter */
export const ORDER_STATUSES: Array<{ value: OrderStatus; label: string }> = [
  { value: 'pending', label: 'Chờ xử lý' },
  { value: 'confirmed', label: 'Đã xác nhận' },
  { value: 'processing', label: 'Đang xử lý' },
  { value: 'shipping', label: 'Đang giao hàng' },
  { value: 'delivered', label: 'Đã giao hàng' },
  { value: 'cancelled', label: 'Đã hủy' },
  { value: 'returned', label: 'Đã trả hàng' },
]

// ── Data Shapes 

/** Item trong đơn hàng — dùng trong admin order detail */
export interface OrderItem {
  _id: string
  orderId: string
  productId: string
  title: string
  thumbnail?: string
  quantity: number
  price: number
  totalPrice: number
  createdAt: string
}

export interface AdminPayment {
  _id: string
  orderId: string
  userId: string
  paymentMethod: PaymentMethod
  amount: number
  currency: string
  status: PaymentStatus
  transactionId?: string
  paymentUrl?: string
  createdAt: string
  updatedAt?: string | null
  /** Populated via $lookup từ orders collection */
  order?: AdminOrder
}

export interface AdminOrder {
  _id: string
  userId: string
  /** Tái sử dụng UserInfo đã định nghĩa ở phần client */
  userInfo: UserInfo
  orderCode?: number
  voucherCode?: string | null
  discountVoucher: number
  shippingFee: number
  totalPrice: number
  status: OrderStatus
  deliveredAt?: string | null
  createdAt: string
  updatedAt?: string | null
  /** Populated via $lookup — object đơn (sau addFields arrayElemAt) */
  payment?: AdminPayment
  items?: OrderItem[]
}

// ── Query Params 

export interface AdminOrderQueryParams {
  page?: number
  perPage?: number
  keyword?: string
  status?: OrderStatus | 'all' | ''
  sortField?: string
  sortOrder?: 'asc' | 'desc'
}

export interface AdminPaymentQueryParams {
  page?: number
  perPage?: number
  keyword?: string
  status?: PaymentStatus | 'all' | ''
  paymentMethod?: PaymentMethod | 'all' | ''
  sortField?: string
  sortOrder?: 'asc' | 'desc'
}

// ── API Responses 

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface AdminOrderListResponse {
  data: AdminOrder[]
  pagination: PaginationMeta
}

export interface AdminPaymentListResponse {
  data: AdminPayment[]
  pagination: PaginationMeta
}

export interface AdminPaymentStats {
  pending: number
  completed: number
  cancelled: number
  totalRevenue: number
}
