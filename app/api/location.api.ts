import axios from 'axios'
import type { Province } from '~/types/location.type'

export const getProvincesRequest = async (): Promise<Province[]> => {
  const response = await axios.get<Province[]>('https://provinces.open-api.vn/api/?depth=3')
  return response.data
}
