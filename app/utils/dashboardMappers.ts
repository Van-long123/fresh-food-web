import type { DashboardOrderChartItem, DashboardTopProduct } from '~/types/dashboard.type'

// Tên thứ trong tuần (vi-VN ngắn gọn)
const DAY_NAMES_VN = ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7']

/**
 * Chuyển mảng ordersChart (7 ngày) thành labels & data cho PrimeVue Chart (bar).
 * Tên label là tên thứ trong tuần tiếng Việt. */
export const mapOrdersChartData = (items: DashboardOrderChartItem[]) => {
  const labels = items.map(item => {
    const d = new Date(item.date)
    return DAY_NAMES_VN[d.getDay()]
  })
  const data = items.map(item => item.count)
  return { labels, data }
}

/**
 * Chuyển mảng doanh thu 12 tháng thành labels & data cho PrimeVue Chart (line). */
export const mapRevenueChartData = (revenueArr: number[]) => {
  const labels = Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`)
  return { labels, data: revenueArr }
}

/**
 * Tạo dữ liệu biểu đồ doughnut từ top products. */
export const mapTopProductChartData = (
  products: DashboardTopProduct[],
  colors: string[]
) => {
  return {
    labels: products.map(p => p.title),
    datasets: [
      {
        data: products.map(p => p.soldCount),
        backgroundColor: colors.slice(0, products.length)
      }
    ]
  }
}

/**
 * Định dạng doanh thu ước tính cho top products.
 * Ví dụ: 156200000 → "156.200.000đ" */
export const formatRevenue = (value: number): string => {
  return `${value.toLocaleString('vi-VN')}đ`
}

/**
 * Định dạng tổng tiền cho card stats — hiển thị số đầy đủ (VD: 2.130.000.000đ). */
export const formatStatRevenue = (value: number): string => {
  if (!value) return '0đ'
  return `${value.toLocaleString('vi-VN')}đ`
}

/**
 * Format số lượng lớn (VD: 1248 → "1.248") */
export const formatStatNumber = (value: number): string => {
  return (value || 0).toLocaleString('vi-VN')
}
