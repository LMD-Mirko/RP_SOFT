export function Avatar({ initials, color = 'bg-gray-400', className = '' }) {
  return (
    <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-white text-xs font-semibold ${color} ${className}`}>
      {initials}
    </span>
  )
}
