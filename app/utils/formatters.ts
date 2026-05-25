import type { CouponType } from '~/types/voucher'

/**
 * Định dạng chuỗi ngày tháng sang kiểu vi-VN (VD: 25 thg 4, 2024)
 */
export const formatDate = (dateStr: string | null) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/**
 * Định dạng ngày giờ chi tiết
 * @param dateStr Chuỗi ngày giờ
 * @param style 'short' (vd: 25/05/2026 15:30) hoặc 'long' (vd: 25 tháng 5, 2026 15:30)
 */
export const formatDateTime = (dateStr: string | Date | null | undefined, style: 'short' | 'long' = 'short') => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("vi-VN", {
    year: "numeric",
    month: style === 'long' ? "long" : "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Định dạng số lượng lớn sang kiểu rút gọn (VD: 4500 -> 4.5k+)
 */
export const formatCount = (num: number | undefined) => {
  if (num === undefined) return "0";
  if (num >= 1000) return (num / 1000).toFixed(1) + "k+";
  return num.toString();
};

/**
 * Định dạng ngày hết hạn (25/04/2024)
 */
export const formatExpireDate = (date: string | Date | null): string => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

/**
 * Tính số ngày còn lại của voucher
 */
export const formatExpireText = (endDate: string | Date | null): string => {
  if (!endDate) return ''
  const end = new Date(endDate)
  const now = new Date()
  const diffMs = end.getTime() - now.getTime()
  if (diffMs <= 0) return 'Đã hết hạn'
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 1) return 'Còn 1 ngày'
  return `Còn ${diffDays} ngày`
}

/**
 * Tạo nhãn hiển thị giá trị giảm giá
 */
export const buildValueLabel = (type: CouponType, discountValue: number): string => {
  if (type === 'percent') return `GIẢM ${discountValue}%`
  if (type === 'freeship') {
    return discountValue > 0 ? `GIẢM ${(discountValue / 1000).toFixed(0)}K SHIP` : '0Đ SHIP'
  }
  return `GIẢM ${(discountValue / 1000).toFixed(0)}K`
}

/**
 * Ánh xạ trạng thái đơn hàng sang tiếng Việt
 */
export const mapOrderStatus = (status: string): string => {
  const map: Record<string, string> = {
    pending: "Chờ xác nhận",
    confirmed: "Đã xác nhận",
    processing: "Đang xử lý",
    shipping: "Đang giao",
    delivered: "Thành công",
    cancelled: "Đã hủy",
    returned: "Trả hàng"
  }
  return map[status] || status
}

/**
 * Tạo slug từ chuỗi tiếng Việt (mirror backend slugify logic)
 */
export const slugify = (val: string): string => {
  if (!val) return ''
  return String(val)
    .normalize('NFKD')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

/**
 * Format giá VND
 */
export const formatVND = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}
