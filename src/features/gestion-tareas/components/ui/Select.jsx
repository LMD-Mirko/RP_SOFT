export function Select({ className = '', children, ...props }) {
  const base = 'w-full h-9 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400';
  return (
    <select className={`${base} ${className}`} {...props}>
      {children}
    </select>
  )
}
