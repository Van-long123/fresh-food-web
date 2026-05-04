import { API_ENDPOINTS } from '~/constants/api'
import { getAuthorizedAxios } from '~/utils/authorizedAxios'
import type { CartRequestItem, CartResponse } from '~/types/cart.type'

export const getCartRequest = async (): Promise<CartResponse> => {
  const response = await getAuthorizedAxios().get(API_ENDPOINTS.CART.GET)
  return response.data
}

export const addCartItemRequest = async (payload: CartRequestItem): Promise<CartResponse> => {
  const response = await getAuthorizedAxios().post(API_ENDPOINTS.CART.ADD_ITEM, payload)
  return response.data
}

export const updateCartItemRequest = async (productId: string, quantity: number): Promise<CartResponse> => {
  const response = await getAuthorizedAxios().patch(API_ENDPOINTS.CART.UPDATE_ITEM(productId), { quantity })
  return response.data
}

export const removeCartItemRequest = async (productId: string): Promise<CartResponse> => {
  const response = await getAuthorizedAxios().delete(API_ENDPOINTS.CART.REMOVE_ITEM(productId))
  return response.data
}

export const removeCartItemsRequest = async (productIds: string[]): Promise<CartResponse> => {
  const response = await getAuthorizedAxios().delete(API_ENDPOINTS.CART.REMOVE_ITEMS, {
    data: { productIds }
  })
  return response.data
}

export const mergeCartRequest = async (items: CartRequestItem[]): Promise<CartResponse> => {
  const response = await getAuthorizedAxios().post(API_ENDPOINTS.CART.MERGE, { items })
  return response.data
}

export const validateCartRequest = async (items: CartRequestItem[]): Promise<CartResponse> => {
  const response = await getAuthorizedAxios().post(API_ENDPOINTS.CART.VALIDATE, { items })
  return response.data
}
