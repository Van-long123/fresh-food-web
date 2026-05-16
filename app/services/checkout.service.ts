import { 
  getShippingFeeRequest, 
  validateStockRequest, 
  createCodOrderRequest 
} from '~/api/checkout.api'
import type { 
  ShippingFeePayload, 
  StockValidationItem,
  CodCheckoutPayload
} from '~/types/checkout.type'

export const checkoutService = {
  getShippingFee: (payload: ShippingFeePayload) => getShippingFeeRequest(payload),
  validateStock: (items: StockValidationItem[]) => validateStockRequest(items),
  createCodOrder: (payload: CodCheckoutPayload) => createCodOrderRequest(payload)
}
