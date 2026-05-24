import { useMutation, useQueryClient } from '@tanstack/vue-query'
import {
  addCartItemRequest,
  mergeCartRequest,
  removeCartItemRequest,
  removeCartItemsRequest,
  updateCartItemRequest,
  validateCartRequest
} from '~/api/client/cart.api'
import { cartKeys } from '~/queries/cart/useCartQuery'
import type { CartRequestItem } from '~/types/cart.type'
import { useCartStore } from '~/stores/useCartStore'

export const useAddCartItemMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CartRequestItem) => addCartItemRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all })
    }
  })
}

export const useUpdateCartItemMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) => updateCartItemRequest(productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all })
    }
  })
}

export const useRemoveCartItemMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (productId: string) => removeCartItemRequest(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all })
    }
  })
}

export const useRemoveCartItemsMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (productIds: string[]) => removeCartItemsRequest(productIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all })
    }
  })
}

export const useMergeCartMutation = () => {
  const queryClient = useQueryClient()
  const cartStore = useCartStore()
  return useMutation({
    mutationFn: (items: CartRequestItem[]) => mergeCartRequest(items),
    onSuccess: (data) => {
      console.log("🚀 ~ useMergeCartMutation ~ data:", data)
      queryClient.invalidateQueries({ queryKey: cartKeys.all })
      
     // Đồng bộ trực tiếp với cửa hàng Pinia để giao diện người dùng cập nhật ngay lập tức
      const mergedItemsMap = new Map<string, any>();
      data.items.forEach((item) => {
        const existing = mergedItemsMap.get(item.productId);
        if (existing) {
          existing.quantity += item.quantity;
        } else {
          mergedItemsMap.set(item.productId, {
            id: item.productId,
            productId: item.productId,
            categoryId: item.categoryId || null,
            name: item.name,
            image: item.image,
            price: item.price,
            originalPrice: item.originalPrice,
            stock: item.stock,
            quantity: item.quantity,
            slug: item.slug,
            unit: item.unit
          });
        }
      });
      cartStore.setCartItems(Array.from(mergedItemsMap.values()));
    }
  })
}

export const useValidateCartMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (items: CartRequestItem[]) => validateCartRequest(items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all })
    }
  })
}
