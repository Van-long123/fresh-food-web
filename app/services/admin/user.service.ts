import {
  getAdminUsersRequest,
  getAdminUserDetailRequest,
  createAdminUserRequest,
  updateAdminUserRequest,
  deleteAdminUserRequest,
  bulkDeleteAdminUsersRequest,
  bulkUpdateAdminUsersStatusRequest
} from '~/api/admin/userApi'
import type {
  AdminUser,
  AdminUserListResponse,
  AdminUserPayload,
  AdminUserQueryParams,
  UserFormData
} from '~/types/user.type'

export const adminUserService = {
  getList: (params?: AdminUserQueryParams): Promise<AdminUserListResponse> =>
    getAdminUsersRequest(params),

  getDetail: (id: string): Promise<AdminUser> =>
    getAdminUserDetailRequest(id),

  create: (payload: AdminUserPayload | FormData): Promise<AdminUser> =>
    createAdminUserRequest(payload),

  update: (id: string, payload: Partial<AdminUserPayload> | FormData): Promise<AdminUser> =>
    updateAdminUserRequest(id, payload),

  delete: (id: string): Promise<AdminUser> =>
    deleteAdminUserRequest(id),

  deleteMany: (ids: string[]) =>
    bulkDeleteAdminUsersRequest(ids),

  updateStatusMany: (ids: string[], isActive: boolean) =>
    bulkUpdateAdminUsersStatusRequest(ids, isActive)
}



const appendField = (fd: FormData, key: string, value: unknown) => {
  if (value === null || value === undefined) return
  fd.append(key, String(value))
}

export const buildCreateAdminUserPayload = (form: UserFormData): FormData => {
  const fd = new FormData()
  appendField(fd, 'displayName', form.displayName.trim())
  appendField(fd, 'email', form.email.trim())
  appendField(fd, 'phone', form.phone.trim())
  appendField(fd, 'role', form.role)
  appendField(fd, 'roleId', form.roleId || '')
  appendField(fd, 'address', form.address || '')
  appendField(fd, 'gender', form.gender || '')
  appendField(fd, 'birthday', form.birthday || '')
  if (form.isActive !== undefined) {
    appendField(fd, 'isActive', String(form.isActive))
  }

  if (form.avatar instanceof File) {
    fd.append('avatar', form.avatar, form.avatar.name)
  } else if (typeof form.avatar === 'string' && form.avatar) {
    appendField(fd, 'avatar', form.avatar)
  }

  return fd
}

export const buildUpdateAdminUserPayload = (form: Partial<UserFormData>): FormData => {
  const fd = new FormData()
  if (form.displayName !== undefined) appendField(fd, 'displayName', form.displayName.trim())
  if (form.email !== undefined) appendField(fd, 'email', form.email.trim())
  if (form.phone !== undefined) appendField(fd, 'phone', form.phone.trim())
  if (form.role !== undefined) appendField(fd, 'role', form.role)
  if (form.roleId !== undefined) appendField(fd, 'roleId', form.roleId || '')
  if (form.address !== undefined) appendField(fd, 'address', form.address || '')
  if (form.gender !== undefined) appendField(fd, 'gender', form.gender || '')
  if (form.birthday !== undefined) appendField(fd, 'birthday', form.birthday || '')
  if (form.isActive !== undefined) appendField(fd, 'isActive', String(form.isActive))

  if (form.avatar instanceof File) {
    fd.append('avatar', form.avatar, form.avatar.name)
  } else if (typeof form.avatar === 'string' && form.avatar) {
    appendField(fd, 'avatar', form.avatar)
  }

  return fd
}
