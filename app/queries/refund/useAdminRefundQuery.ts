import { computed, type Ref, unref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { adminRefundRequestService } from '~/services/admin/refundRequest.service'
import type { AdminRefundRequestQueryParams } from '~/types/refund.type'

export const adminRefundKeys = {
  all: ['admin-refund-requests'] as const,
  list: (params?: AdminRefundRequestQueryParams) => ['admin-refund-requests', 'list', params] as const,
  detail: (id: string) => ['admin-refund-requests', 'detail', id] as const
}

export const useAdminRefundRequestsQuery = (
  params?: Ref<AdminRefundRequestQueryParams> | AdminRefundRequestQueryParams
) => {
  return useQuery({
    queryKey: computed(() => adminRefundKeys.list(unref(params))),
    queryFn: () => adminRefundRequestService.getRequests(unref(params))
  })
}

export const useAdminRefundRequestDetailQuery = (id: Ref<string | undefined> | string | undefined) => {
  return useQuery({
    queryKey: computed(() => adminRefundKeys.detail(unref(id) as string)),
    queryFn: () => {
      const resolvedId = unref(id)
      if (!resolvedId || resolvedId === 'undefined' || resolvedId === 'null') {
        return Promise.reject(new Error('Invalid refund request ID'))
      }
      return adminRefundRequestService.getDetail(resolvedId)
    },
    enabled: computed(() => {
      const resolvedId = unref(id)
      return !!resolvedId && resolvedId !== 'undefined' && resolvedId !== 'null'
    })
  })
}
