import { Search, Filter, ShieldCheck } from 'lucide-react'

const statusOptions = [
  { value: 'all', label: 'Todos los estados' },
  { value: 'activo', label: 'Activos' },
  { value: 'pendiente', label: 'Pendientes' },
  { value: 'suspendido', label: 'Suspendidos' },
]

const sortOptions = [
  { value: 'name-asc', label: 'Nombre (A-Z)' },
  { value: 'name-desc', label: 'Nombre (Z-A)' },
  { value: 'last-access', label: 'Último acceso' },
  { value: 'created-at', label: 'Fecha de alta' },
]

export function UserFilters({ filters, onChange, roleOptions }) {
  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    onChange({ [field]: value })
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={filters.search}
              onChange={handleChange('search')}
              placeholder="Buscar por nombre, correo o rol"
              className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-3 text-sm outline-none transition focus:border-gray-900"
            />
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-900 hover:text-gray-900"
          >
            <Filter size={16} />
            Filtros rápidos
          </button>
        </div>

        <div className="grid flex-1 grid-cols-1 gap-3 md:grid-cols-3">
          <select
            value={filters.role}
            onChange={handleChange('role')}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-gray-900"
          >
            <option value="all">Todos los roles</option>
            {roleOptions.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={handleChange('status')}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-gray-900"
          >
            {statusOptions.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>

          <select
            value={filters.sortBy}
            onChange={handleChange('sortBy')}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-gray-900"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-600 transition hover:border-gray-900 hover:text-gray-900">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
            checked={filters.showOnlyAdmins}
            onChange={handleChange('showOnlyAdmins')}
          />
          <ShieldCheck size={16} />
          Solo administradores
        </label>
      </div>
    </div>
  )
}

UserFilters.defaultProps = {
  filters: {
    search: '',
    role: 'all',
    status: 'all',
    sortBy: 'name-asc',
    showOnlyAdmins: false,
  },
  roleOptions: [],
  onChange: () => {},
}

