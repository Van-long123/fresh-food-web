import { computed, type Ref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { unref } from 'vue'
import { adminProductService } from '~/services/admin/product.service'
import type { AdminProductQueryParams } from '~/types/product.type'

export const adminProductKeys = {
  all: ['admin-products'] as const,
  list: (params?: AdminProductQueryParams) => ['admin-products', 'list', params] as const,
  detail: (id: string) => ['admin-products', 'detail', id] as const
}

export const useAdminProductsQuery = (params?: Ref<AdminProductQueryParams> | AdminProductQueryParams) => {
  return useQuery({
    queryKey: computed(() => adminProductKeys.list(unref(params))),
    queryFn: () => adminProductService.getList(unref(params)),
  })
}
