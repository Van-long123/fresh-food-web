import { computed, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { adminRoleService } from '~/services/admin/role.service'
import { adminRoleKeys } from './useAdminRolesQuery'

export const useAdminRoleDetailQuery = (id: Ref<string | null>) => {
  const enabled = computed(() => Boolean(id.value))

  return useQuery({
    queryKey: computed(() => adminRoleKeys.detail(id.value as string)),
    enabled,
    queryFn: () => adminRoleService.getDetail(id.value as string),
    staleTime: 60_000
  })
}
