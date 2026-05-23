import {
  getAdminRolesRequest,
  getAdminRoleDetailRequest,
  createAdminRoleRequest,
  updateAdminRoleRequest,
  deleteAdminRoleRequest,
  deleteAdminRolesRequest
} from '~/api/admin/roleApi'
import type {
  AdminRole,
  AdminRoleListResponse,
  AdminRolePayload,
  AdminRoleQueryParams
} from '~/types/role.type'

export const adminRoleService = {
  getList: (params?: AdminRoleQueryParams): Promise<AdminRoleListResponse> =>
    getAdminRolesRequest(params),

  getDetail: (id: string): Promise<AdminRole> =>
    getAdminRoleDetailRequest(id),

  create: (payload: AdminRolePayload): Promise<AdminRole> =>
    createAdminRoleRequest(payload),

  update: (id: string, payload: Partial<AdminRolePayload>): Promise<AdminRole> =>
    updateAdminRoleRequest(id, payload),

  delete: (id: string): Promise<AdminRole> =>
    deleteAdminRoleRequest(id),

  deleteMany: (ids: string[]): Promise<{ deletedCount: number }> =>
    deleteAdminRolesRequest(ids)
}
