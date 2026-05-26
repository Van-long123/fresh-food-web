import { computed, type Ref, unref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { adminOrderService } from '~/services/admin/order.service'
import type { AdminPaymentQueryParams } from '~/types/order.type'

export const adminPaymentKeys = {
  all: ['admin-payments'] as const,
  list: (params?: AdminPaymentQueryParams) => ['admin-payments', 'list', params] as const,
  stats: () => ['admin-payments', 'stats'] as const,
}

export const useAdminPaymentsQuery = (
  params?: Ref<AdminPaymentQueryParams> | AdminPaymentQueryParams,
) => {
  return useQuery({
    queryKey: computed(() => adminPaymentKeys.list(unref(params))),
    queryFn: () => adminOrderService.getPayments(unref(params)),
  })
}

export const useAdminPaymentStatsQuery = () => {
  return useQuery({
    queryKey: adminPaymentKeys.stats(),
    queryFn: () => adminOrderService.getPaymentStats(),
  })
}
