export function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={typeof title === 'string' ? title : 'Modal'}>
      <div className="absolute inset-0 bg-black/40 opacity-100 transition-opacity duration-200" onClick={onClose} />
      <div className="absolute inset-x-0 top-10 mx-auto w-full max-w-lg">
        <div className="relative rounded-2xl border border-gray-200 bg-white p-6 shadow-xl transition-all duration-200 transform opacity-100 translate-y-0 scale-100">
          {title && (
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{title}</h3>
              <button className="h-8 w-8 inline-flex items-center justify-center rounded-full hover:bg-gray-100" onClick={onClose} aria-label="Cerrar">✕</button>
            </div>
          )}
          <div className="max-h-[70vh] overflow-y-auto pr-1">{children}</div>
          {footer && <div className="mt-4 flex justify-end gap-2">{footer}</div>}
        </div>
      </div>
    </div>
  )
}
