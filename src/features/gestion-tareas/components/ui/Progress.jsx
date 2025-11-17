export function Progress({ value = 0, max = 100, color = 'blue', className = '' }) {
  const pct = Math.max(0, Math.min(100, (value / (max || 1)) * 100))
  const colors = {
    blue: 'bg-blue-600',
    green: 'bg-emerald-600',
    violet: 'bg-violet-600',
    orange: 'bg-orange-500',
    gray: 'bg-gray-400',
  }
  return (
    <div className={`w-full h-2 rounded-full bg-gray-100 ${className}`}>
      <div className={`h-2 rounded-full ${colors[color] || colors.blue}`} style={{ width: pct + '%' }} />
    </div>
  )
}
