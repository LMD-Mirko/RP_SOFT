export function Button({ children, variant = 'primary', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-10 px-7';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-400',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-400',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-900',
    outline: 'border border-gray-300 text-gray-900 hover:bg-gray-100',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-400',
    light: 'bg-white border border-gray-300 text-gray-900 hover:bg-gray-50 focus:ring-gray-300',
    dark: 'bg-black text-white hover:bg-neutral-800 focus:ring-black',
  };
  return (
    <button className={`${base} ${variants[variant] ?? variants.primary} ${className}`} {...props}>
      {children}
    </button>
  );
}