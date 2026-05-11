import { useMutation, useQueryClient } from '@tanstack/vue-query'
import {
  createAddressRequest,
  updateAddressRequest,
  deleteAddressRequest
} from '~/api/address.api'
import { addressKeys } from '~/queries/address/useAddressQueries'

export const useCreateAddressMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createAddressRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.lists() })
    }
  })
}

export const useUpdateAddressMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateAddressRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.lists() })
    }
  })
}

export const useDeleteAddressMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteAddressRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.lists() })
    }
  })
}
