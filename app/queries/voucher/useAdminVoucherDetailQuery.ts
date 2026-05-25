import { computed, type Ref, unref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { adminVoucherService } from '~/services/admin/voucher.service'
import { adminVoucherKeys } from './useAdminVouchersQuery'

export const useAdminVoucherDetailQuery = (id: Ref<string | null>) => {
  const enabled = computed(() => Boolean(id.value))

  return useQuery({
    queryKey: computed(() => adminVoucherKeys.detail(id.value as string)),
    enabled,
    queryFn: () => adminVoucherService.getDetail(unref(id) as string),
    staleTime: 60_000,
  })
}