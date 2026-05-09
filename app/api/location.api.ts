import { API_ENDPOINTS } from '~/constants/api'
import { getAuthorizedAxios } from '~/utils/authorizedAxios'
import type { GhnProvince, GhnDistrict, GhnWard } from '~/types/location.type'

export const getProvincesRequest = async (): Promise<GhnProvince[]> => {
  const response = await getAuthorizedAxios().get(API_ENDPOINTS.LOCATION.PROVINCES)
  return response.data.data
}

export const getDistrictsRequest = async (provinceId: number): Promise<GhnDistrict[]> => {
  const response = await getAuthorizedAxios().get(API_ENDPOINTS.LOCATION.DISTRICTS, {
    params: { provinceId }
  })
  return response.data.data
}

export const getWardsRequest = async (districtId: number): Promise<GhnWard[]> => {
  const response = await getAuthorizedAxios().get(API_ENDPOINTS.LOCATION.WARDS, {
    params: { districtId }
  })
  return response.data.data
}
