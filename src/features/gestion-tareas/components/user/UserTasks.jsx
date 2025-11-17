import { useState } from 'react'
import { Calendar, Pencil, Plus } from 'lucide-react'
import { Input } from '../ui/Input'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { useMyTasks } from '../../hooks/useMyTasks'
import { createTask, updateTask } from '../../services/my-tasks.service'
import { TaskForm } from './TaskForm'

const priorityVariant = (p) => (p === 'Alta' ? 'danger' : p === 'Media' ? 'warning' : 'neutral')
const statusVariant = (s) => (s === 'Completado' ? 'success' : s === 'En Proceso' ? 'info' : 'neutral')

export function UserTasks() {
  const { loading, tasks, query, setQuery, status, setStatus, statuses, total, reload } = useMyTasks()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const openCreate = () => { setEditing(null); setOpen(true) }
  const openEdit = (task) => { setEditing(task); setOpen(true) }
  const close = () => setOpen(false)

  const handleSubmit = async (payload) => {
    if (editing?.id) {
      await updateTask(editing.id, payload)
    } else {
      await createTask(payload)
    }
    await reload()
    setOpen(false)
  }

  return (
    <div className="space-y-4">
      <Input
        className="h-12 rounded-xl bg-white border border-gray-200 shadow-sm"
        placeholder="Buscar tareas..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="text-sm text-gray-500 mb-3">Filtrar Tareas</div>
        <div className="flex flex-wrap items-center gap-2">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`${status === s ? 'bg-gray-900 text-white' : 'bg-white text-gray-700'} rounded-full border border-gray-200 px-4 h-9 text-sm shadow-sm`}
            >
              {s}
            </button>
          ))}
          <div className="ml-auto">
            <Button variant="dark" onClick={openCreate}><Plus size={18} className="mr-2" /> Nueva Tarea</Button>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="px-4 py-3 text-sm text-gray-700 border-b border-gray-200">Tareas ({total})</div>
        <div className="grid grid-cols-12 px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50">
          <div className="col-span-5">Título</div>
          <div className="col-span-2">Equipo</div>
          <div className="col-span-1">Prioridad</div>
          <div className="col-span-2">Hasta Cuándo</div>
          <div className="col-span-1">Estado</div>
          <div className="col-span-1 text-right">Acciones</div>
        </div>

        {loading ? (
          <div className="px-4 py-8 text-center text-gray-600">Cargando...</div>
        ) : tasks.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-600">No se encontraron tareas</div>
        ) : (
          tasks.map((t) => (
            <div key={t.id} className="grid grid-cols-12 px-4 py-4 border-t border-gray-200 items-center">
              <div className="col-span-5 min-w-0">
                <div className="font-semibold text-gray-900">{t.titulo}</div>
                <div className="text-sm text-gray-600 truncate">{t.descripcion}</div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {t.tags.map((tag) => (
                    <Badge key={tag} variant="info">{tag}</Badge>
                  ))}
                </div>
              </div>
              <div className="col-span-2">
                <Badge variant="neutral">{t.equipo}</Badge>
              </div>
              <div className="col-span-1">
                <Badge variant={priorityVariant(t.prioridad)}>{t.prioridad}</Badge>
              </div>
              <div className="col-span-2">
                <div className="inline-flex items-center gap-2 text-sm text-gray-700">
                  <Calendar size={16} /> {t.hasta}
                </div>
              </div>
              <div className="col-span-1">
                <Badge variant={statusVariant(t.estado)}>{t.estado}</Badge>
              </div>
              <div className="col-span-1 flex justify-end">
                <Button variant="primary" className="h-9 w-9 p-0" onClick={() => openEdit(t)}> <Pencil size={16} /> </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        open={open}
        onClose={close}
        title={editing ? 'Editar Tarea' : 'Nueva Tarea'}
        footer={null}
      >
        <TaskForm initialValue={editing} onSubmit={handleSubmit} onCancel={close} />
      </Modal>
    </div>
  )
}
