import { computed, type Ref, unref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { adminOrderService } from '~/services/admin/order.service'
import type { AdminOrderQueryParams } from '~/types/order.type'

export const adminOrderKeys = {
  all: ['admin-orders'] as const,
  list: (params?: AdminOrderQueryParams) => ['admin-orders', 'list', params] as const,
  detail: (id: string) => ['admin-orders', 'detail', id] as const,
}

export const useAdminOrdersQuery = (
  params?: Ref<AdminOrderQueryParams> | AdminOrderQueryParams,
) => {
  return useQuery({
    queryKey: computed(() => adminOrderKeys.list(unref(params))),
    queryFn: () => adminOrderService.getOrders(unref(params)),
  })
}

export const useAdminOrderDetailQuery = (id: Ref<string | undefined> | string | undefined) => {
  return useQuery({
    queryKey: computed(() => adminOrderKeys.detail(unref(id) as string)),
    queryFn: () => {
      const resolvedId = unref(id)
      if (!resolvedId || resolvedId === 'undefined' || resolvedId === 'null') {
        return Promise.reject(new Error('Invalid order ID'))
      }
      return adminOrderService.getDetail(resolvedId)
    },
    enabled: computed(() => {
      const resolvedId = unref(id)
      return !!resolvedId && resolvedId !== 'undefined' && resolvedId !== 'null'
    }),
  })
}
