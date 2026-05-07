import type { AdminRoleForm, AdminRoleListItem } from '~/types/admin-role.type'

const mockRoles: AdminRoleListItem[] = [
  {
    id: 'ROLE-ADMIN',
    name: 'Admin',
    description: 'Full system access',
    usersCount: 3
  },
  {
    id: 'ROLE-STAFF',
    name: 'Staff',
    description: 'Limited catalog and order access',
    usersCount: 8
  }
]

export const useRolesApi = (useMock = true) => {
  const { public: { apiBaseUrl } } = useRuntimeConfig()

  const listRoles = async () => {
    if (useMock) return { data: mockRoles, total: mockRoles.length }
    return await $fetch<{ data: AdminRoleListItem[]; total: number }>(`${apiBaseUrl}/v1/admin/roles`)
  }

  const getRole = async (id: string) => {
    if (useMock) {
      const role = mockRoles.find((item) => item.id === id)
      if (!role) return null
      return {
        name: role.name,
        description: role.description,
        permissions: {
          Articles: ['view', 'create', 'edit'],
          Products: ['view', 'create', 'edit', 'delete'],
          Orders: ['view', 'edit'],
          Users: ['view']
        }
      } as AdminRoleForm
    }
    return await $fetch<AdminRoleForm>(`${apiBaseUrl}/v1/admin/roles/${id}`)
  }

  const updateRole = async (id: string, payload: AdminRoleForm) => {
    if (useMock) return { success: true }
    return await $fetch(`${apiBaseUrl}/v1/admin/roles/${id}`, { method: 'PUT', body: payload })
  }

  return {
    listRoles,
    getRole,
    updateRole
  }
}
