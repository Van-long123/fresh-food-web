import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useToast } from 'primevue/usetoast'
import { adminRefundRequestService } from '~/services/admin/refundRequest.service'
import { adminRefundKeys } from '~/queries/refund/useAdminRefundQuery'

export const useApproveAdminRefundRequestMutation = () => {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: (id: string) => adminRefundRequestService.approve(id),
    onSuccess: (_data, requestId) => {
      toast.add({
        severity: 'success',
        summary: 'Thành công',
        detail: 'Đã duyệt yêu cầu hoàn tiền',
        life: 3000
      })
      queryClient.invalidateQueries({ queryKey: adminRefundKeys.all, refetchType: 'all' })
      queryClient.invalidateQueries({ queryKey: adminRefundKeys.detail(requestId) })
    },
    onError: (error: any) => {
      toast.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: error?.response?.data?.message || 'Không thể duyệt yêu cầu hoàn tiền',
        life: 3000
      })
    }
  })
}

export const useRejectAdminRefundRequestMutation = () => {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      adminRefundRequestService.reject(id, reason),
    onSuccess: (_data, variables) => {
      toast.add({
        severity: 'warn',
        summary: 'Đã từ chối',
        detail: 'Yêu cầu hoàn tiền đã bị từ chối',
        life: 3000
      })
      queryClient.invalidateQueries({ queryKey: adminRefundKeys.all, refetchType: 'all' })
      queryClient.invalidateQueries({ queryKey: adminRefundKeys.detail(variables.id) })
    },
    onError: (error: any) => {
      toast.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: error?.response?.data?.message || 'Không thể từ chối yêu cầu hoàn tiền',
        life: 3000
      })
    }
  })
}

export const useCompleteAdminRefundRequestMutation = () => {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: FormData | Record<string, any> }) =>
      adminRefundRequestService.complete(id, payload),
    onSuccess: (_data, variables) => {
      toast.add({
        severity: 'success',
        summary: 'Hoàn tất',
        detail: 'Yêu cầu hoàn tiền đã hoàn tất',
        life: 3000
      })
      queryClient.invalidateQueries({ queryKey: adminRefundKeys.all, refetchType: 'all' })
      queryClient.invalidateQueries({ queryKey: adminRefundKeys.detail(variables.id) })
    },
    onError: (error: any) => {
      toast.add({
        severity: 'error',
        summary: 'Lỗi',
        detail: error?.response?.data?.message || 'Không thể hoàn tất yêu cầu hoàn tiền',
        life: 3000
      })
    }
  })
}
