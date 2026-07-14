/**
 * useOrderSocket.ts — Composable
 * Đóng gói logic kết nối Socket.IO và lắng nghe sự kiện:
 *  - ORDER_STATUS_UPDATED: Cập nhật trạng thái đơn hàng
 *  - REFUND_STATUS_UPDATED: Cập nhật trạng thái hoàn tiền
 *
 * RULE: Composable này KHÔNG dùng Lifecycle Hooks (onMounted/onUnmounted).
 * Lifecycle hooks phải được đặt trong file .vue gọi composable này.
 * Composable chỉ trả về hàm setup/cleanup để .vue file kiểm soát lifecycle.
 */

import { useQueryClient } from '@tanstack/vue-query'
import { useToast } from 'primevue/usetoast'
import { socketUtils } from '~/utils/socket'
import { SOCKET_EVENTS } from '~/constants/socketEvents'
import { useAuthStore } from '~/stores/useAuthStore'
import { STATUS_MAP } from '~/constants/order'

export type OrderSocketPayload = {
  orderId: string
  status: string
  orderCode?: number
}

export type RefundSocketPayload = {
  refundId: string
  orderId: string
  status: string
}

// Map nhãn tiếng Việt cho trạng thái hoàn tiền — tái sử dụng cùng bảng với useAdminSocket
const REFUND_STATUS_LABEL: Record<string, string> = {
  pending: 'Đang chờ xử lý',
  approved_waiting_pickup: 'Chờ shipper đến lấy hàng',
  processing_refund: 'Đang hoàn tiền',
  completed: 'Hoàn tiền thành công ✓',
  rejected: 'Yêu cầu bị từ chối',
}

/**
 * @param watchOrderId - ID của đơn hàng cần theo dõi realtime
 */
export const useOrderSocket = (watchOrderId: string) => {
  const queryClient = useQueryClient()
  const toast = useToast()
  const authStore = useAuthStore()

  // Tính baseURL từ runtimeConfig (tái sử dụng giống authorizedAxios.ts)
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBaseUrl as string

  /**
   * Xử lý khi nhận sự kiện ORDER_STATUS_UPDATED từ server.
   * Chỉ phản ứng nếu orderId khớp với đơn đang xem.
   */
  const onOrderStatusUpdated = (payload: OrderSocketPayload) => {
    if (!payload || payload.orderId !== watchOrderId) {
      return
    }

    // Invalidate query để tự động refetch dữ liệu mới nhất — tái sử dụng queryKey từ useOrderDetailQuery
    queryClient.invalidateQueries({ queryKey: ['order-detail', watchOrderId] })
    queryClient.invalidateQueries({ queryKey: ['my-orders'] })

    // Bỏ qua toast nếu status = 'returned' hoặc 'cancelled' để tránh double toast 
    // (returned dùng toast của refund, cancelled dùng toast của mutation)
    if (payload.status === 'returned' || payload.status === 'cancelled') return

    // Lấy label từ STATUS_MAP đã có sẵn trong constants/order — không hardcode
    const statusInfo = STATUS_MAP[payload.status as keyof typeof STATUS_MAP]
    const statusLabel = statusInfo?.label || payload.status

    toast.add({
      severity: 'info',
      summary: '🔔 Đơn hàng được cập nhật',
      detail: `Trạng thái đơn hàng đã chuyển sang: ${statusLabel}`,
      life: 5000,
    })
  }

  /**
   * Xử lý khi nhận sự kiện REFUND_STATUS_UPDATED từ server.
   * Chỉ phản ứng nếu orderId khớp với đơn đang xem.
   */
  const onRefundStatusUpdated = (payload: RefundSocketPayload) => {
    if (!payload || payload.orderId !== watchOrderId) {
      return
    }

    // F5 trạng thái yêu cầu hoàn tiền và chi tiết đơn hàng trên trang
    queryClient.invalidateQueries({ queryKey: ['refund-requests', watchOrderId] })
    // Invalidate order-detail để trạng thái đơn hàng (VD: returned) cũng được cập nhật ngay
    queryClient.invalidateQueries({ queryKey: ['order-detail', watchOrderId] })
    queryClient.invalidateQueries({ queryKey: ['my-orders'] })

    const statusLabel = REFUND_STATUS_LABEL[payload.status] || payload.status

    // Phân biệt Toast theo trạng thái để User nhận thông báo đúng ngữ cảnh
    const isCompleted = payload.status === 'completed'
    const isRejected = payload.status === 'rejected'

    toast.add({
      severity: isCompleted ? 'success' : isRejected ? 'error' : 'info',
      summary: isCompleted ? '✅ Hoàn tiền thành công!' : isRejected ? '❌ Yêu cầu bị từ chối' : '↩️ Cập nhật hoàn tiền',
      detail: `Yêu cầu hoàn tiền của bạn: ${statusLabel}`,
      life: 6000,
    })
  }

  /**
   * Kết nối socket và đăng ký listener.
   * Được gọi từ onMounted trong file .vue
   */
  const setupSocket = () => {
    // Chỉ chạy trên client, không chạy khi SSR
    if (!import.meta.client) return

    const userId = authStore.user?.id
    if (!userId) {
      console.log('[useOrderSocket] Người dùng chưa đăng nhập, bỏ qua kết nối socket.')
      return
    }

    const socket = socketUtils.connectSocket(baseURL, String(userId))
    socket.on(SOCKET_EVENTS.ORDER_STATUS_UPDATED, onOrderStatusUpdated)
    socket.on(SOCKET_EVENTS.REFUND_STATUS_UPDATED, onRefundStatusUpdated)
  }

  /**
   * Gỡ listener và ngắt kết nối socket.
   * Được gọi từ onUnmounted trong file .vue
   */
  const cleanupSocket = () => {
    const socket = socketUtils.getSocket()
    if (socket) {
      socket.off(SOCKET_EVENTS.ORDER_STATUS_UPDATED, onOrderStatusUpdated)
      socket.off(SOCKET_EVENTS.REFUND_STATUS_UPDATED, onRefundStatusUpdated)
    }
    socketUtils.disconnectSocket()
  }

  return {
    setupSocket,
    cleanupSocket,
  }
}
