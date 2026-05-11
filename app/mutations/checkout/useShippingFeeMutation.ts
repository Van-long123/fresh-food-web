import { useMutation } from '@tanstack/vue-query'
import { checkoutService } from '~/services/checkout.service'
// import { getShippingFeeRequest } from '~/api/checkout.api'
import type { ShippingFeePayload } from '~/types/checkout.type'

export const useShippingFeeMutation = () => {
  return useMutation({
    mutationFn: (payload: ShippingFeePayload) => checkoutService.getShippingFee(payload)
    // mutationFn: checkoutService.getShippingFee
    // mutationFn: getShippingFeeRequest
  })
}
