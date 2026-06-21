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

  const onOrderStatusUpdated = (payload: any) => {
    if (!payload) return

    // Invalidate list orders của admin để cập nhật realtime
    queryClient.invalidateQueries({ queryKey: ['admin-orders'] })
    if (payload.orderId) {
      queryClient.invalidateQueries({ queryKey: ['admin-order-detail', payload.orderId] })
    }

    const statusInfo = STATUS_MAP[payload.status as keyof typeof STATUS_MAP]
    const statusLabel = statusInfo?.label || payload.status

    toast.add({
      severity: 'info',
      summary: '🔔 Đơn hàng được cập nhật',
      detail: `Đơn hàng #${payload.orderId?.slice(-6)?.toUpperCase() || ''} vừa chuyển sang: ${statusLabel}`,
      life: 5000,
    })
  }

  const setupSocket = () => {
    if (!import.meta.client) return

    const userId = authStore.user?.id
    if (!userId) return

    // Pass role = admin
    const socket = socketUtils.connectSocket(baseURL, String(userId), 'admin')
    socket.on(SOCKET_EVENTS.ORDER_STATUS_UPDATED, onOrderStatusUpdated)
  }

  const cleanupSocket = () => {
    const socket = socketUtils.getSocket()
    if (socket) {
      socket.off(SOCKET_EVENTS.ORDER_STATUS_UPDATED, onOrderStatusUpdated)
    }
    // We don't disconnect here because they might navigate between admin pages.
    // Or we could disconnect if they leave admin entirely.
  }

  return { setupSocket, cleanupSocket }
}
