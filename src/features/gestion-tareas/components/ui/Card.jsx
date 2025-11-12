export function Card({ title, value, icon, color = 'gray', className = '' }) {
  const colorMap = {
    blue: { bg: 'bg-blue-100 text-blue-600', text: 'text-blue-600' },
    orange: { bg: 'bg-orange-100 text-orange-600', text: 'text-orange-600' },
    violet: { bg: 'bg-violet-100 text-violet-600', text: 'text-violet-600' },
    green: { bg: 'bg-emerald-100 text-emerald-600', text: 'text-emerald-600' },
    gray: { bg: 'bg-gray-100 text-gray-600', text: 'text-gray-900' },
  }
  const Icon = icon
  return (
    <div className={`rounded-2xl border border-gray-200 bg-white p-6 shadow-sm ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-500">{title}</div>
          <div className={`mt-1 text-2xl font-semibold ${colorMap[color]?.text || 'text-gray-900'}`}>{value}</div>
        </div>
        {Icon ? (
          <span className={`inline-flex h-11 w-11 items-center justify-center rounded-full ${colorMap[color]?.bg || colorMap.gray.bg}`}>
            <Icon size={20} />
          </span>
        ) : null}
      </div>
    </div>
  )
}