import { computed, type Ref, unref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { adminVoucherService } from '~/services/admin/voucher.service'
import type { AdminVoucherQueryParams } from '~/types/voucher'

export const adminVoucherKeys = {
  all: ['admin-vouchers'] as const,
  list: (params?: AdminVoucherQueryParams) => ['admin-vouchers', 'list', params] as const,
  detail: (id: string) => ['admin-vouchers', 'detail', id] as const,
}

export const useAdminVouchersQuery = (
  params?: Ref<AdminVoucherQueryParams> | AdminVoucherQueryParams,
) => {
  return useQuery({
    queryKey: computed(() => adminVoucherKeys.list(unref(params))),
    queryFn: () => adminVoucherService.getList(unref(params)),
  })
}