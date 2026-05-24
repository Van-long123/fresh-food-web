import { computed, type Ref, unref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { adminUserService } from '~/services/admin/user.service'
import type { AdminUserQueryParams } from '~/types/user.type'

export const adminUserKeys = {
  all: ['admin-users'] as const,
  list: (params?: AdminUserQueryParams) => ['admin-users', 'list', params] as const,
  detail: (id: string) => ['admin-users', 'detail', id] as const
}

export const useAdminUsersQuery = (params?: Ref<AdminUserQueryParams> | AdminUserQueryParams) => {
  return useQuery({
    queryKey: computed(() => adminUserKeys.list(unref(params))),
    queryFn: () => adminUserService.getList(unref(params))
  })
}
