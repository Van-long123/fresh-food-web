import { 
  getShippingFeeRequest, 
  validateStockRequest, 
  createCodOrderRequest,
  createPayOSOrderRequest
} from '~/api/checkout.api'
import type { 
  ShippingFeePayload, 
  StockValidationItem,
  CodCheckoutPayload,
  PayOSCheckoutPayload
} from '~/types/checkout.type'

export const checkoutService = {
  getShippingFee: (payload: ShippingFeePayload) => getShippingFeeRequest(payload),
  validateStock: (items: StockValidationItem[]) => validateStockRequest(items),
  createCodOrder: (payload: CodCheckoutPayload) => createCodOrderRequest(payload),
  createPayOSOrder: (payload: PayOSCheckoutPayload) => createPayOSOrderRequest(payload)
}
