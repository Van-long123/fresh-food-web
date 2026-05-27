import { useQuery } from '@tanstack/vue-query'
import { adminProductService } from '~/services/admin/product.service'

const adminCategoryKeys = {
  all: ['admin-categories'] as const
}

/**
 * Lấy danh sách categories cho dropdown/multiselect trong form product.
 * Chỉ lấy categories type=product và status=active. */
export const useAdminCategoriesQuery = () => {
  return useQuery({
    queryKey: adminCategoryKeys.all,
    queryFn: () => adminProductService.getCategories(),
    staleTime: 5 * 60_000, // 5 phút vì categories hiếm khi thay đổi
    select: (data) => data.data.filter((c) => c.type === 'product' && c.status === 'active')
  })
}
