import { useQueryClient } from '@tanstack/vue-query'
import { useToast } from 'primevue/usetoast'
import { socketUtils } from '~/utils/socket'
import { SOCKET_EVENTS } from '~/constants/socketEvents'
import { useAuthStore } from '~/stores/useAuthStore'
import { STATUS_MAP } from '~/constants/order'


export const useAdminSocket = () => {
  const queryClient = useQueryClient()
  const toast = useToast()
  const authStore = useAuthStore()
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBaseUrl as string

  // ORDER handler 
  const onOrderStatusUpdated = (payload: any) => {
    if (!payload) return

    // Invalidate list orders của admin để cập nhật realtime
    queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
    queryClient.invalidateQueries({ queryKey: ['admin-payments'] })
    if (payload.orderId) {
      queryClient.invalidateQueries({ queryKey: ['admin-order-detail', payload.orderId] })
    }

    const shortId = payload.orderCode || payload.orderId?.slice(-6)?.toUpperCase() || ''

    // Phân biệt: Đơn hàng MỚI vs Đơn hàng ĐỔI TRẠNG THÁI
    if (payload.status === 'pending') {
      toast.add({
        severity: 'success',
        summary: '🛒 Đơn hàng mới!',
        detail: `Khách vừa đặt đơn hàng #${shortId} — Kiểm tra ngay!`,
        life: 6000,
      })
    } else {
      // Bỏ qua toast cập nhật sang trạng thái 'returned' do mutation hoàn tiền đã show toast rồi (tránh double-toast)
      if (payload.status === 'returned') return
      
      const statusInfo = STATUS_MAP[payload.status as keyof typeof STATUS_MAP]
      const statusLabel = statusInfo?.label || payload.status
      toast.add({
        severity: 'info',
        summary: '🔔 Đơn hàng được cập nhật',
        detail: `Đơn hàng #${shortId} vừa chuyển sang: ${statusLabel}`,
        life: 5000,
      })
    }
  }

  // ─── REFUND handler ───────────────────────────────────────────────────────
  const onRefundStatusUpdated = (payload: any) => {
    if (!payload) return

    // F5 danh sách và chi tiết hoàn tiền cho Admin
    queryClient.invalidateQueries({ queryKey: ['admin-refund-requests'] })
    if (payload.refundId) {
      queryClient.invalidateQueries({ queryKey: ['admin-refund-requests', 'detail', payload.refundId] })
    }

    const shortOrderId = payload.orderId?.slice(-6)?.toUpperCase() || ''

    // Phân biệt: Yêu cầu hoàn tiền MỚI vs Cập nhật trạng thái hoàn tiền
    if (payload.status === 'pending') {
      toast.add({
        severity: 'warn',
        summary: '↩️ Yêu cầu hoàn tiền mới!',
        detail: `Đơn hàng #${shortOrderId} — Khách vừa gửi yêu cầu hoàn tiền!`,
        life: 6000,
      })
    }
    // Bỏ qua toast thông báo cập nhật trạng thái ở đây để tránh bị double-toast
    // vì Admin thực hiện hành động (duyệt/từ chối) đã nhận được toast từ phần mutation rồi.
  }

  const setupSocket = () => {
    if (!import.meta.client) return

    const userId = authStore.user?.id
    if (!userId) return

    // Pass role = admin
    const socket = socketUtils.connectSocket(baseURL, String(userId), 'admin')
    socket.on(SOCKET_EVENTS.ORDER_STATUS_UPDATED, onOrderStatusUpdated)
    socket.on(SOCKET_EVENTS.REFUND_STATUS_UPDATED, onRefundStatusUpdated)
  }

  const cleanupSocket = () => {
    const socket = socketUtils.getSocket()
    if (socket) {
      socket.off(SOCKET_EVENTS.ORDER_STATUS_UPDATED, onOrderStatusUpdated)
      socket.off(SOCKET_EVENTS.REFUND_STATUS_UPDATED, onRefundStatusUpdated)
    }
    // We don't disconnect here because they might navigate between admin pages.
  }

  return { setupSocket, cleanupSocket }
}
