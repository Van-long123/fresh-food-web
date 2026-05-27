// Dashboard Types 

export interface DashboardGrowth {
  products: number
  orders: number
  revenue: number
  customers: number
}

export interface DashboardStats {
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  totalCustomers: number
  growth: DashboardGrowth
}

export interface DashboardOrderChartItem {
  date: string       // YYYY-MM-DD
  count: number
}

export interface DashboardTopProduct {
  _id: string
  title: string
  thumbnail: string
  soldCount: number
  stock: number
  price: number
  revenue: number
  category: string
}

export interface DashboardRecentOrder {
  _id: string
  orderCode: string
  customerName: string
  totalPrice: number
  status: string
  createdAt: string | Date
}

export interface DashboardOverview {
  stats: DashboardStats
  /** Mảng 12 phần tử, mỗi phần tử là doanh thu (triệu VND) của tháng tương ứng */
  revenueChart: number[]
  /** Mảng 7 ngày gần nhất */
  ordersChart: DashboardOrderChartItem[]
  topProducts: DashboardTopProduct[]
  recentOrders: DashboardRecentOrder[]
}
