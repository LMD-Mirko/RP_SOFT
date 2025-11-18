import { MoreHorizontal } from 'lucide-react'

const statusStyles = {
  activo: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-100',
  pendiente: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-100',
  suspendido: 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-100',
}

export function UserTable({ users }) {
  if (users.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center text-gray-500">
        No se encontraron usuarios con los filtros seleccionados.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-100">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Usuario</th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Rol</th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Estado</th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Equipos</th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Último acceso</th>
            <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-6 py-4">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">{user.name}</span>
                  <span className="text-xs text-gray-500">{user.email}</span>
                </div>
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-900">{user.role}</span>
                  {user.isAdmin && (
                    <span className="rounded-full bg-gray-900 px-2 py-0.5 text-xs font-medium text-white">
                      Admin
                    </span>
                  )}
                </div>
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${statusStyles[user.status]}`}>
                  {user.status === 'pendiente' ? 'Pendiente de invitación' : user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-2">
                  {user.teams.map((team) => (
                    <span
                      key={team}
                      className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                    >
                      {team}
                    </span>
                  ))}
                </div>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {user.lastAccess ? new Date(user.lastAccess).toLocaleString('es-PE') : 'Sin acceso'}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                <button
                  type="button"
                  className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                  aria-label={`Acciones sobre ${user.name}`}
                >
                  <MoreHorizontal size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

UserTable.defaultProps = {
  users: [],
}

