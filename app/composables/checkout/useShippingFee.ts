import { computed, watch } from 'vue'
import type { Ref } from 'vue'
import { useShippingFeeMutation } from '~/mutations/checkout/useShippingFeeMutation'
import type { ShippingFeePayload, ShippingFeeResponse } from '../../types/checkout.type'

/**
 * Tự động gọi API mỗi khi selectedAddressId thay đổi và có giá trị.
 *
 * Trả về:
 *  - shippingFee: số tiền phí ship (computed)
 *  - isFetchingShippingFee: đang call API
 *  - shippingFeeData: toàn bộ response
 *  - fetchShippingFee: gọi thủ công nếu cần (ví dụ sau khi edit địa chỉ) */
export const useShippingFee = (
  selectedAddressId: Ref<string | null>,
  cartProducts?: Ref<Array<{ _id?: string; id?: string | number; title?: string; name?: string; quantity: number }>>
) => {
  const mutation = useShippingFeeMutation()

  const buildPayload = (addressId: string): ShippingFeePayload => {
    const products = (cartProducts?.value ?? []).map(p => ({
      _id:      String(p._id ?? p.id ?? ''),
      name:     String(p.name ?? p.title ?? 'Sản phẩm'),
      quantity: Number(p.quantity) || 1
    })).filter(p => p._id)

    return { addressId, products: products.length ? products : undefined }
  }

  // Tự động gọi API khi địa chỉ thay đổi
  watch(
    selectedAddressId,
    (newId) => {
      if (newId) {
        mutation.mutate(buildPayload(newId))
      }
    },
    { immediate: true }
  )

  const shippingFee = computed<number>(() => {
    return (mutation.data.value as ShippingFeeResponse | undefined)?.shippingFee ?? 0
  })

  const shippingFeeData = computed<ShippingFeeResponse | undefined>(() => {
    return mutation.data.value as ShippingFeeResponse | undefined
  })

  const isFetchingShippingFee = computed(() => mutation.isPending.value)

  const fetchShippingFee = (addressId: string) => {
    mutation.mutate(buildPayload(addressId))
  }

  return {
    shippingFee,
    shippingFeeData,
    isFetchingShippingFee,
    fetchShippingFee
  }
}
