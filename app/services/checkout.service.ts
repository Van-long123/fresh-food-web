import { getShippingFeeRequest } from '~/api/checkout.api'
import type { ShippingFeePayload } from '~/types/checkout.type'

export const checkoutService = {
  getShippingFee: (payload: ShippingFeePayload) => getShippingFeeRequest(payload)
}
