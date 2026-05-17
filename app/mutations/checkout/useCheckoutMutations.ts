import { useMutation } from '@tanstack/vue-query'
import { checkoutService } from '~/services/checkout.service'
import type { StockValidationItem, CodCheckoutPayload } from '~/types/checkout.type'

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
