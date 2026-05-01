import { useQuery } from '@tanstack/vue-query'
import { voucherService } from '~/services/voucher.service'

export const useVoucherListQuery = () => {
  return useQuery({
    queryKey: ['vouchers', 'list'],
    queryFn: () => voucherService.getList({ limit: 100 }),
    staleTime: 5 * 60 * 1000 // 5 phút
  })
}
