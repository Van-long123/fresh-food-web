import {
  addCartItemRequest,
  getCartRequest,
  mergeCartRequest,
  removeCartItemRequest,
  removeCartItemsRequest,
  updateCartItemRequest,
  validateCartRequest
} from '~/api/client/cart.api'
import type { CartRequestItem } from '~/types/cart.type'

export const cartService = {
  getCart: () => getCartRequest(),
  addItem: (payload: CartRequestItem) => addCartItemRequest(payload),
  updateItem: (productId: string, quantity: number) => updateCartItemRequest(productId, quantity),
  removeItem: (productId: string) => removeCartItemRequest(productId),
  removeItems: (productIds: string[]) => removeCartItemsRequest(productIds),
  mergeCart: (items: CartRequestItem[]) => mergeCartRequest(items),
  validateCart: (items: CartRequestItem[]) => validateCartRequest(items)
}
