export function BacklogStatCard({ title, value, icon: Icon, color = 'gray', className = '' }) {
  const colorMap = {
    blue: { bg: 'bg-blue-50 text-blue-600', text: 'text-blue-700' },
    orange: { bg: 'bg-orange-50 text-orange-600', text: 'text-orange-700' },
    violet: { bg: 'bg-violet-50 text-violet-600', text: 'text-violet-700' },
    green: { bg: 'bg-emerald-50 text-emerald-600', text: 'text-emerald-700' },
    gray: { bg: 'bg-gray-50 text-gray-600', text: 'text-gray-900' },
  }
  const c = colorMap[color] || colorMap.gray
  return (
    <div className={`rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition ${className}`}>
      <div className="min-h-[110px] flex flex-col">
        <div className="flex items-center justify-between">
          <div className="text-base md:text-lg font-semibold text-gray-600">{title}</div>
          {Icon ? (
            <span className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${c.bg}`}>
              <Icon size={22} />
            </span>
          ) : null}
        </div>
        <div className={`mt-3 text-4xl md:text-4xl leading-tight font-extrabold text-center ${c.text}`}>{value}</div>
      </div>
    </div>
  )
}
