const cards = [
  {
    key: 'total',
    label: 'Usuarios totales',
    accent: 'bg-gray-900 text-white',
  },
  {
    key: 'active',
    label: 'Activos',
    accent: 'bg-emerald-100 text-emerald-700',
  },
  {
    key: 'pending',
    label: 'Pendientes',
    accent: 'bg-amber-100 text-amber-700',
  },
  {
    key: 'suspended',
    label: 'Suspendidos',
    accent: 'bg-rose-100 text-rose-700',
  },
  {
    key: 'admins',
    label: 'Administradores',
    accent: 'bg-indigo-100 text-indigo-700',
  },
]

export function UserStats({ stats }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
      {cards.map((card) => (
        <div key={card.key} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase text-gray-500">{card.label}</p>
          <p className={`mt-2 inline-flex items-baseline gap-1 rounded-lg px-2 py-1 text-lg font-semibold ${card.accent}`}>
            {stats[card.key] ?? 0}
          </p>
        </div>
      ))}
    </div>
  )
}

UserStats.defaultProps = {
  stats: {
    total: 0,
    active: 0,
    pending: 0,
    suspended: 0,
    admins: 0,
  },
}

