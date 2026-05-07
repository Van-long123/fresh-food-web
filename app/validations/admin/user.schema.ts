import type { AdminUserForm } from '~/types/admin-user.type'

export const validateAdminUser = (form: AdminUserForm) => {
  const errors: Record<string, string> = {}

  if (!form.name.trim()) errors.name = 'Name is required'
  if (!form.email.trim()) errors.email = 'Email is required'
  if (!form.role) errors.role = 'Role is required'
  if (!form.status) errors.status = 'Status is required'
  if (form.password !== undefined && form.password.length < 6) errors.password = 'Password must be at least 6 characters'

  return errors
}
