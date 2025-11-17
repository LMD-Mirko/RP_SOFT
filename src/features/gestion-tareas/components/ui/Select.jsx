export function Select({ className = '', children, ...props }) {
  const base = 'w-full h-10 rounded-xl border border-gray-200 bg-white/90 px-3 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300';
  return (
    <select className={`${base} ${className}`} {...props}>
      {children}
    </select>
  )
}
