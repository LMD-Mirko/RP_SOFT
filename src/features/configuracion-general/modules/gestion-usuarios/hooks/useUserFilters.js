import { useMemo } from 'react'

const sorters = {
  'name-asc': (a, b) => a.name.localeCompare(b.name),
  'name-desc': (a, b) => b.name.localeCompare(a.name),
  'last-access': (a, b) => {
    const dateA = a.lastAccess ? new Date(a.lastAccess).getTime() : 0
    const dateB = b.lastAccess ? new Date(b.lastAccess).getTime() : 0
    return dateB - dateA
  },
  'created-at': (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
}

export function useUserFilters(users, filters) {
  const roleOptions = useMemo(() => {
    const uniqueRoles = new Map()
    users.forEach((user) => {
      if (!uniqueRoles.has(user.roleSlug)) {
        uniqueRoles.set(user.roleSlug, user.role)
      }
    })
    return Array.from(uniqueRoles, ([value, label]) => ({ value, label }))
  }, [users])

  const stats = useMemo(() => {
    return users.reduce(
      (acc, user) => {
        acc.total += 1
        if (user.status === 'activo') acc.active += 1
        if (user.status === 'pendiente') acc.pending += 1
        if (user.status === 'suspendido') acc.suspended += 1
        if (user.isAdmin) acc.admins += 1
        return acc
      },
      { total: 0, active: 0, pending: 0, suspended: 0, admins: 0 }
    )
  }, [users])

  const filteredUsers = useMemo(() => {
    const search = filters.search.trim().toLowerCase()
    return users
      .filter((user) => {
        if (search) {
          const matchesSearch =
            user.name.toLowerCase().includes(search) ||
            user.email.toLowerCase().includes(search) ||
            user.role.toLowerCase().includes(search)
          if (!matchesSearch) return false
        }

        if (filters.role !== 'all' && user.roleSlug !== filters.role) return false
        if (filters.status !== 'all' && user.status !== filters.status) return false
        if (filters.showOnlyAdmins && !user.isAdmin) return false

        return true
      })
      .sort(sorters[filters.sortBy] ?? sorters['name-asc'])
  }, [users, filters])

  return { filteredUsers, stats, roleOptions }
}

