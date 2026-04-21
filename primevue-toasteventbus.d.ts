declare module 'primevue/toasteventbus' {
  interface ToastEventBusType {
    emit: (event: 'add' | 'remove' | 'remove-group' | string, ...args: unknown[]) => void
  }

  const ToastEventBus: ToastEventBusType
  export default ToastEventBus
}
