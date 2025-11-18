import { useState } from 'react'
import { Users, UserPlus } from 'lucide-react'
import { mockUsers } from '../data/mockUsers'
import { useUserFilters } from '../hooks/useUserFilters'
import { UserStats } from '../components/UserStats/UserStats'
import { UserFilters } from '../components/UserFilters/UserFilters'
import { UserTable } from '../components/UserTable/UserTable'

const initialFilters = {
  search: '',
  role: 'all',
  status: 'all',
  sortBy: 'name-asc',
  showOnlyAdmins: false,
}

export function GestionUsuariosPage() {
  const [filters, setFilters] = useState(initialFilters)
  const { filteredUsers, stats, roleOptions } = useUserFilters(mockUsers, filters)

  const handleFilterChange = (patch) => {
    setFilters((prev) => ({ ...prev, ...patch }))
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-medium uppercase text-gray-500">Configuración global</p>
          <div className="mt-1 flex items-center gap-2">
            <Users className="h-5 w-5 text-gray-900" />
            <h1 className="text-2xl font-semibold text-gray-900">Gestión de usuarios</h1>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Administra altas, roles y accesos. Sincroniza los permisos por módulo de forma centralizada.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-900 hover:text-gray-900"
          >
            Exportar reporte
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
            style={{ color: 'white' }}
          >
            <UserPlus size={18} />
            Invitar usuario
          </button>
        </div>
      </header>

      <UserStats stats={stats} />
      <UserFilters filters={filters} onChange={handleFilterChange} roleOptions={roleOptions} />
      <UserTable users={filteredUsers} />
    </div>
  )
}

