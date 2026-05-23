import { computed, type Ref, unref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { adminRoleService } from '~/services/admin/role.service'
import type { AdminRoleQueryParams } from '~/types/role.type'

export const adminRoleKeys = {
  all: ['admin-roles'] as const,
  list: (params?: AdminRoleQueryParams) => ['admin-roles', 'list', params] as const,
  detail: (id: string) => ['admin-roles', 'detail', id] as const
}

export const useAdminRolesQuery = (params?: Ref<AdminRoleQueryParams> | AdminRoleQueryParams) => {
  return useQuery({
    queryKey: computed(() => adminRoleKeys.list(unref(params))),
    queryFn: () => adminRoleService.getList(unref(params))
  })
}
