import { useState } from 'react'
import { Users, Plus, Pencil } from 'lucide-react'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Progress } from '../ui/Progress'
import { useMyTeams } from '../../hooks/useMyTeams'
import { Modal } from '../ui/Modal'
import { TeamForm } from './TeamForm'
import { createTeam, updateTeam } from '../../services/my-teams.service'

export function UserTeams() {
  const { loading, teams, reload } = useMyTeams()
  const [openForm, setOpenForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [openDetails, setOpenDetails] = useState(false)
  const [selected, setSelected] = useState(null)

  const openCreate = () => { setEditing(null); setOpenForm(true) }
  const openEdit = (team) => { setEditing(team); setOpenForm(true) }
  const closeForm = () => setOpenForm(false)
  const showDetails = (team) => { setSelected(team); setOpenDetails(true) }
  const closeDetails = () => setOpenDetails(false)

  const handleSubmit = async (payload) => {
    if (editing?.id) await updateTeam(editing.id, payload)
    else await createTeam(payload)
    await reload()
    setOpenForm(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="dark" onClick={openCreate}><Plus size={18} className="mr-2" /> Nuevo Equipo</Button>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-600 shadow-sm">Cargando...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((t) => (
            <div key={t.id} className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 bg-gray-50/60 border-b border-gray-200">
                <div>
                  <h3 className="font-semibold text-gray-900">{t.nombre}</h3>
                  <p className="text-sm text-gray-600">{t.descripcion}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="light" className="h-9 w-9 p-0" onClick={() => openEdit(t)}><Pencil size={16} /></Button>
                  <Users size={18} className="text-gray-500" />
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-gray-200 p-3">
                    <div className="text-xs text-gray-500">Miembros</div>
                    <div className="text-2xl font-bold">{t.totalMiembros}</div>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-3">
                    <div className="text-xs text-gray-500">Tareas</div>
                    <div className="text-2xl font-bold">{t.totalTareas}</div>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-gray-500 mb-1">Miembros</div>
                  <div className="flex flex-wrap gap-2">
                    {t.miembros.map((m) => (
                      <Badge key={m} variant="neutral">{m}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm text-gray-700 mb-2">
                    <span>{t.progreso}% Tareas Completadas</span>
                  </div>
                  <Progress value={t.progreso} color={t.progreso === 100 ? 'green' : t.progreso >= 50 ? 'yellow' : 'red'} />
                </div>

                <div className="pt-1">
                  <Button variant="light" className="w-full justify-between" onClick={() => showDetails(t)}>Ver Detalles <span>›</span></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={openForm} onClose={closeForm} title={editing ? 'Editar Equipo' : 'Nuevo Equipo'} footer={null}>
        <TeamForm initialValue={editing} onSubmit={handleSubmit} onCancel={closeForm} />
      </Modal>

      <Modal open={openDetails} onClose={closeDetails} title={selected?.nombre || 'Detalles del Equipo'}>
        {selected && (
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-500 mb-1">Descripción</div>
              <div className="text-gray-800">{selected.descripcion}</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-gray-200 p-3">
                <div className="text-xs text-gray-500">Miembros</div>
                <div className="text-2xl font-bold">{selected.totalMiembros}</div>
              </div>
              <div className="rounded-lg border border-gray-200 p-3">
                <div className="text-xs text-gray-500">Tareas</div>
                <div className="text-2xl font-bold">{selected.totalTareas}</div>
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Miembros</div>
              <div className="flex flex-wrap gap-2">
                {selected.miembros.map((m) => (
                  <Badge key={m} variant="neutral">{m}</Badge>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm text-gray-700 mb-2">
                <span>{selected.progreso}% Tareas Completadas</span>
              </div>
              <Progress value={selected.progreso} color={selected.progreso === 100 ? 'green' : selected.progreso >= 50 ? 'yellow' : 'red'} />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
