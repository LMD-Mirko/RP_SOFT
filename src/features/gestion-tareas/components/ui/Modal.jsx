export function Modal({ open, onClose, title, children, footer, containerClassName = '' }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative z-10 w-[900px] h-[300px] max-w-[90vw] rounded-2xl bg-white shadow-2xl overflow-hidden ${containerClassName}`}>
        {title && (
          <div className="px-6 py-3 border-b flex justify-center">
            <h3 className="text-xl font-semibold text-center">{title}</h3>
          </div>
        )}
        <div className="px-6 py-4 h-[calc(300px-48px-56px)] overflow-auto">{children}</div>
        {footer && <div className="px-6 py-3 border-t flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  )
}
