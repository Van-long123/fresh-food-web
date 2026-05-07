import type { AdminUserForm, AdminUserListItem } from '~/types/admin-user.type'

const mockUsers: AdminUserListItem[] = [
  {
    id: 'USR-1001',
    name: 'Neil Sims',
    email: 'neil.sims@flowbite.com',
    role: 'admin',
    status: 'active',
    joinedAt: 'May 1, 2026',
    avatar: 'https://flowbite.com/docs/images/people/profile-picture-1.jpg'
  },
  {
    id: 'USR-1002',
    name: 'Bonnie Green',
    email: 'bonnie@flowbite.com',
    role: 'staff',
    status: 'pending',
    joinedAt: 'Apr 28, 2026',
    avatar: 'https://flowbite.com/docs/images/people/profile-picture-2.jpg'
  }
]

export const useUsersApi = (useMock = true) => {
  const { public: { apiBaseUrl } } = useRuntimeConfig()

  const listUsers = async () => {
    if (useMock) return { data: mockUsers, total: mockUsers.length }
    return await $fetch<{ data: AdminUserListItem[]; total: number }>(`${apiBaseUrl}/v1/admin/users`)
  }

  const getUser = async (id: string) => {
    if (useMock) {
      const user = mockUsers.find((item) => item.id === id)
      if (!user) return null
      return {
        name: user.name,
        email: user.email,
        phone: '',
        role: user.role,
        status: user.status,
        address: '',
        avatar: user.avatar
      }
    }
    return await $fetch<AdminUserForm>(`${apiBaseUrl}/v1/admin/users/${id}`)
  }

  const createUser = async (payload: AdminUserForm) => {
    if (useMock) return { success: true }
    return await $fetch(`${apiBaseUrl}/v1/admin/users`, { method: 'POST', body: payload })
  }

  const updateUser = async (id: string, payload: AdminUserForm) => {
    if (useMock) return { success: true }
    return await $fetch(`${apiBaseUrl}/v1/admin/users/${id}`, { method: 'PUT', body: payload })
  }

  const deleteUser = async (id: string) => {
    if (useMock) return { success: true }
    return await $fetch(`${apiBaseUrl}/v1/admin/users/${id}`, { method: 'DELETE' })
  }

  return {
    listUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
  }
}
