export function Badge({ children, variant = 'default', className = '' }) {
  const base = 'inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[13px] font-semibold';
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    warning: 'bg-orange-100 text-orange-700',
    info: 'bg-blue-100 text-blue-700',
    success: 'bg-emerald-100 text-emerald-700',
    purple: 'bg-violet-100 text-violet-700',
    neutral: 'bg-gray-100 text-gray-700',
    danger: 'bg-red-100 text-red-700',
    pink: 'bg-pink-100 text-pink-700',
  }
  return (
    <span className={`${base} ${variants[variant] ?? variants.default} ${className}`}>
      {children}
    </span>
  )
}