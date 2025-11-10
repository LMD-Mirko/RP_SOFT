export function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={typeof title === 'string' ? title : 'Modal'}>
      <div className="absolute inset-0 bg-black/40 opacity-100 transition-opacity duration-200" onClick={onClose} />
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-2xl relative rounded-2xl border border-gray-200 bg-white shadow-xl transition-all duration-200">
          {title && (
            <div className="flex items-center justify-between px-8 pt-5 pb-3 border-b border-gray-200">
              <h3 className="text-xl font-bold tracking-tight">{title}</h3>
              <button className="h-8 w-8 inline-flex items-center justify-center rounded-full hover:bg-gray-100" onClick={onClose} aria-label="Cerrar">✕</button>
            </div>
          )}
          <div className="px-8 py-6 max-h-[70vh] overflow-y-auto">{children}</div>
          {footer && <div className="px-8 pt-4 pb-6 border-t border-gray-200 flex justify-end gap-2">{footer}</div>}
        </div>
      </div>
    </div>
  )
}
