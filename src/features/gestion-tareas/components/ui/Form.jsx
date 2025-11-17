export function Form({ onSubmit, children, className = '' }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit?.(e)
  }
  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      {children}
    </form>
  )
}

export function FormField({ label, children, hint, required = false }) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label} {required && <span className="text-rose-600">*</span>}
        </label>
      )}
      {children}
      {hint && <div className="text-xs text-gray-500">{hint}</div>}
    </div>
  )}
