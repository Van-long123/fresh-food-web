import { computed } from 'vue'
import { useAuthStore } from '~/stores/useAuthStore'

type PermissionInput = string | string[]

export const usePermissions = () => {
  const authStore = useAuthStore()

  const permissions = computed(() => authStore.user?.permissions ?? [])
  const isSystem = computed(() => Boolean(authStore.user?.isSystem))
  const permissionsLoaded = computed(() => authStore.adminPermissionsResolved)

  const hasPermission = (permission: PermissionInput) => {
    // System admin (isSystem: true hoặc có id trong SYSTEM_ROLE_IDS) → full quyền tuyệt đối
    if (isSystem.value) return true

    // Quyền chưa được resolve từ backend → chặn truy cập để tránh false-negative
    if (!permissionsLoaded.value) return false

    const required = Array.isArray(permission) ? permission : [permission]
    return required.some((item) => permissions.value.includes(item))
  }

  return {
    permissions,
    isSystem,
    permissionsLoaded,
    hasPermission
  }
}
