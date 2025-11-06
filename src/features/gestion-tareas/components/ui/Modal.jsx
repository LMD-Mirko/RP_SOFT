export function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-lg bg-white shadow-xl">
        {title && (
          <div className="px-5 py-3 border-b">
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
        )}
        <div className="px-5 py-4">{children}</div>
        {footer && <div className="px-5 py-3 border-t flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  )
}
