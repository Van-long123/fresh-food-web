/**
 * socket.ts — Utility (Pure JS logic, không phụ thuộc Vue state)
 * Quản lý duy nhất 1 instance socket.io-client cho toàn bộ ứng dụng.
 * Tái sử dụng cùng baseURL từ runtimeConfig thông qua tham số truyền vào.
 *
 * API:
 *  - connectSocket(baseURL, userId): Tạo/kết nối socket, truyền userId để BE nhận diện
 *  - disconnectSocket(): Ngắt kết nối và dọn dẹp instance
 *  - getSocket(): Lấy instance hiện tại (null nếu chưa kết nối)
 */

import { io, type Socket } from 'socket.io-client'

let socketInstance: Socket | null = null

/**
 * Kết nối socket đến server.
 * Nếu đã có instance đang kết nối thì trả về instance cũ (tránh double-connect).
 * @param baseURL - URL của BE server (lấy từ runtimeConfig.public.apiBaseUrl)
 * @param userId  - MongoDB _id của user đang đăng nhập, dùng để BE ánh xạ socket → user
 * @param role    - Tùy chọn: Vai trò của user (ví dụ: 'admin') để join các room đặc quyền
 */
const connectSocket = (baseURL: string, userId: string, role?: string): Socket => {
  // Trả về instance cũ nếu còn kết nối, tránh mở nhiều connection trùng lặp
  if (socketInstance?.connected) {
    return socketInstance
  }

  // Ngắt kết nối cũ (nếu đang disconnect nhưng chưa được dọn) trước khi tạo mới
  if (socketInstance) {
    socketInstance.disconnect()
    socketInstance = null
  }

  socketInstance = io(baseURL, {
    // Truyền userId và role qua query params để BE ghi nhận
    query: { userId, role },
    // Ưu tiên websocket, fallback sang polling nếu websocket bị block
    transports: ['websocket', 'polling'],
    // Tự động reconnect với backoff
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
    // Không cần withCredentials vì không dùng cookie cho socket (dùng userId query param)
    withCredentials: false,
  })

  socketInstance.on('connect', () => {
    console.log(`[Socket] Connected | socketId: ${socketInstance?.id} | userId: ${userId}`)
  })

  socketInstance.on('disconnect', (reason) => {
    console.log(`[Socket] Disconnected | reason: ${reason}`)
  })

  socketInstance.on('connect_error', (error) => {
    console.warn(`[Socket] Connection error:`, error.message)
  })

  return socketInstance
}

/**
 * Ngắt kết nối và xóa instance.
 * Gọi khi user logout hoặc component bị unmounted (cleanup).
 */
const disconnectSocket = (): void => {
  if (socketInstance) {
    socketInstance.disconnect()
    socketInstance = null
    console.log('[Socket] Disconnected and cleaned up.')
  }
}

/**
 * Lấy socket instance hiện tại.
 * Trả về null nếu chưa kết nối.
 */
const getSocket = (): Socket | null => socketInstance

export const socketUtils = {
  connectSocket,
  disconnectSocket,
  getSocket,
}
