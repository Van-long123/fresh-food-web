export const STATUS_MAP: Record<string, any> = {
  pending: {
    label: "Chờ xác nhận",
    color: "bg-yellow-100 text-yellow-700",
    icon: "⏳",
    dot: true,
  },
  confirmed: {
    label: "Đã xác nhận",
    color: "bg-blue-100 text-blue-700",
    icon: "✅",
    dot: false,
  },
  processing: {
    label: "Đang xử lý",
    color: "bg-indigo-100 text-indigo-700",
    icon: "⚙️",
    dot: true,
  },
  shipping: {
    label: "Đang giao",
    color: "bg-sky-100 text-sky-700",
    icon: "🚴",
    dot: true,
  },
  delivered: {
    label: "Đã giao",
    color: "bg-green-100 text-green-700",
    icon: "📦",
    dot: false,
  },
  cancelled: {
    label: "Đã hủy",
    color: "bg-red-100 text-red-600",
    icon: "✕",
    dot: false,
  },
  returned: {
    label: "Đã hoàn trả",
    color: "bg-gray-100 text-gray-600",
    icon: "↩️",
    dot: false,
  },
};

export const PAYMENT_METHOD_MAP: Record<string, any> = {
  COD: { label: "Tiền mặt (COD)", icon: "💵", color: "text-green-700" },
  PayOS: { label: "PayOS", icon: "💳", color: "text-blue-700" },
  Momo: { label: "Ví MoMo", icon: "💜", color: "text-purple-700" },
};

export const PAYMENT_STATUS_MAP: Record<string, any> = {
  pending: { label: "Chờ thanh toán", color: "bg-yellow-100 text-yellow-700" },
  completed: { label: "Đã thanh toán", color: "bg-green-100 text-green-700" },
  failed: { label: "Thất bại", color: "bg-red-100 text-red-600" },
  cancelled: { label: "Đã hủy", color: "bg-gray-100 text-gray-600" },
  refunded: { label: "Đã hoàn tiền", color: "bg-blue-100 text-blue-700" },
};

export const TIMELINE_STEPS = [
  { key: "pending", label: "Đặt hàng", icon: "📋" },
  { key: "confirmed", label: "Xác nhận", icon: "✅" },
  { key: "processing", label: "Đóng gói", icon: "📦" },
  { key: "shipping", label: "Đang giao", icon: "🚴" },
  { key: "delivered", label: "Đã nhận", icon: "🏠" },
];
