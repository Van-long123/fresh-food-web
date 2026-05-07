export type AdminRolePermission = 'view' | 'create' | 'edit' | 'delete'

export interface AdminRoleListItem {
  id: string
  name: string
  description: string
  usersCount: number
}

export interface AdminRoleForm {
  name: string
  description: string
  permissions: Record<string, AdminRolePermission[]>
}
