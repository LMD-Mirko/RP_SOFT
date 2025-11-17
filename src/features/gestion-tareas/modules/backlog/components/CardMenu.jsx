import { useState, useRef, useEffect } from 'react'
import { MoreVertical, Edit3, Copy, Trash2, PlusCircle } from 'lucide-react'

export function CardMenu({ onEdit, onAddSprint, onDuplicate, onDelete }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handle = (e) => {
      if (!ref.current) return
      if (!ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        className="h-8 w-8 inline-flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600"
        aria-label="Opciones"
        onClick={() => setOpen((v) => !v)}
      >
        <MoreVertical size={18} />
      </button>
      {open && (
        <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 w-44 rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden z-10">
          <button className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2" onClick={onEdit}>
            <Edit3 size={16} /> Editar
          </button>
          <button className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2" onClick={onAddSprint}>
            <PlusCircle size={16} /> Agregar Sprint
          </button>
          <button className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2" onClick={onDuplicate}>
            <Copy size={16} /> Duplicar
          </button>
          <button className="w-full px-3 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2" onClick={onDelete}>
            <Trash2 size={16} /> Eliminar
          </button>
        </div>
      )}
    </div>
  )
}
