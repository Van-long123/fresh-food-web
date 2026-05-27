import { getDashboardOverviewRequest, exportDashboardDataRequest } from '~/api/admin/dashboardApi'
import type { DashboardOverview } from '~/types/dashboard.type'

export const adminDashboardService = {
  getOverview: (): Promise<DashboardOverview> => getDashboardOverviewRequest(),
  exportData: (): Promise<any> => exportDashboardDataRequest()
}
