/**
 * socketEvents.ts
 * Nguồn sự thật duy nhất cho tên các Socket.IO event.
 * Phải khớp chính xác với SOCKET_EVENTS trong BE socketManager.js.
 */
export const SOCKET_EVENTS = {
  ORDER_STATUS_UPDATED: 'ORDER_STATUS_UPDATED',
} as const

export type SocketEventName = typeof SOCKET_EVENTS[keyof typeof SOCKET_EVENTS]
