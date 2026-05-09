import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import {
  getAddressesRequest,
  createAddressRequest,
  updateAddressRequest,
  deleteAddressRequest
} from '~/api/address.api'

export const addressKeys = {
  all: ['addresses'] as const,
  lists: () => [...addressKeys.all, 'list'] as const,
}

export const useAddressesQuery = () => {
  return useQuery({
    queryKey: addressKeys.lists(),
    queryFn: getAddressesRequest,
  })
}

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
