import type { AdminRoleForm } from '~/types/admin-role.type'

export const validateAdminRole = (form: AdminRoleForm) => {
  const errors: Record<string, string> = {}

  if (!form.name.trim()) errors.name = 'Role name is required'
  if (!form.description.trim()) errors.description = 'Description is required'

  return errors
}
