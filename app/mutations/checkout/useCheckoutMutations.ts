import { useMutation } from '@tanstack/vue-query'
import { checkoutService } from '~/services/checkout.service'
import type { StockValidationItem, CodCheckoutPayload, PayOSCheckoutPayload } from '~/types/checkout.type'

export const useValidateStockMutation = () => {
  return useMutation({
    mutationFn: (items: StockValidationItem[]) => checkoutService.validateStock(items)
  })
}

export const useCreateCodOrderMutation = () => {
  return useMutation({
    mutationFn: (payload: CodCheckoutPayload) => checkoutService.createCodOrder(payload)
  })
}

export const useCreatePayOSOrderMutation = () => {
  return useMutation({
    mutationFn: (payload: PayOSCheckoutPayload) => checkoutService.createPayOSOrder(payload)
  })
}
