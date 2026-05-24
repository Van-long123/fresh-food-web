import { getAuthorizedAxios } from '~/utils/authorizedAxios'
import { API_ENDPOINTS } from '~/constants/api'
import type { Address, AddressPayload } from '~/types/address.type'

export const getAddressesRequest = async (): Promise<Address[]> => {
  const response = await getAuthorizedAxios().get(API_ENDPOINTS.ADDRESS.LIST)
  return response.data.data
}

export const createAddressRequest = async (payload: AddressPayload): Promise<Address> => {
  const response = await getAuthorizedAxios().post(API_ENDPOINTS.ADDRESS.CREATE, payload)
  return response.data.data
}

export const updateAddressRequest = async ({ id, payload }: { id: string; payload: AddressPayload }): Promise<Address> => {
  const response = await getAuthorizedAxios().put(API_ENDPOINTS.ADDRESS.UPDATE(id), payload)
  return response.data.data
}

export const deleteAddressRequest = async (id: string): Promise<any> => {
  const response = await getAuthorizedAxios().delete(API_ENDPOINTS.ADDRESS.DELETE(id))
  return response.data.data
}
