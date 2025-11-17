export function IconCircle({ children, color = 'blue', className = '' }) {
  const colors = {
    blue: 'bg-blue-100 text-blue-600',
    orange: 'bg-orange-100 text-orange-600',
    violet: 'bg-violet-100 text-violet-600',
    green: 'bg-emerald-100 text-emerald-600',
    gray: 'bg-gray-100 text-gray-600',
  }
  return (
    <span className={`inline-flex items-center justify-center h-9 w-9 rounded-full ${colors[color] ?? colors.gray} ${className}`}>
      {children}
    </span>
  )
}
