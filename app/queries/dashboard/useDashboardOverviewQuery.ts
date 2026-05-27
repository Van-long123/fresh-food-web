import { useQuery } from '@tanstack/vue-query'
import { adminDashboardService } from '~/services/admin/dashboard.service'

export const dashboardKeys = {
  all: ['admin-dashboard'] as const,
  overview: () => ['admin-dashboard', 'overview'] as const
}

/**
 * Query hook lấy toàn bộ dữ liệu Dashboard Overview trong một request.
 * KHÔNG sử dụng lifecycle hooks ở đây — chỉ dùng ở file .vue.
 */
export const useDashboardOverviewQuery = () => {
  return useQuery({
    queryKey: dashboardKeys.overview(),
    queryFn: () => adminDashboardService.getOverview(),
    staleTime: 1000 * 60 * 5, // 5 phút cache
    retry: 2
  })
}
