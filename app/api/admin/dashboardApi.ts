import { API_ENDPOINTS } from '~/constants/api'
import { getAuthorizedAxios } from '~/utils/authorizedAxios'
import type { DashboardOverview } from '~/types/dashboard.type'

export const exportDashboardDataRequest = async (): Promise<any> => {
  const response = await getAuthorizedAxios().get(API_ENDPOINTS.ADMIN.DASHBOARD.EXPORT)
  return response.data?.data || response.data
}

export const getDashboardOverviewRequest = async (): Promise<DashboardOverview> => {
  const response = await getAuthorizedAxios().get(API_ENDPOINTS.ADMIN.DASHBOARD.OVERVIEW)
  return response.data?.data || response.data
}
