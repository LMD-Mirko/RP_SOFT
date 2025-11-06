import { useMemo } from 'react'
import { Users, FileText, Code2, CheckCircle2, Eye, Play, ChevronDown, User } from 'lucide-react'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { IconCircle } from '../ui/IconCircle'
import { useSelectionPanel } from '../../hooks/useSelectionPanel'

export function SelectionPanel() {
  const {
    loading,
    applicants,
    stages,
    statuses,
    query,
    setQuery,
    stage,
    setStage,
    status,
    setStatus,
    stats,
    detailId,
    openDetails,
    closeDetails,
    startTestId,
    openStartTest,
    closeStartTest,
  } = useSelectionPanel()

  const detailApplicant = useMemo(() => applicants.find((a) => a.id === detailId), [applicants, detailId])
  const startTestApplicant = useMemo(() => applicants.find((a) => a.id === startTestId), [applicants, startTestId])

  const estadoToBadge = (estado) => {
    if (estado === 'Pendiente') return { variant: 'warning', label: 'Pendiente' }
    if (estado === 'En Prueba') return { variant: 'purple', label: 'En Prueba' }
    if (estado === 'Aprobado') return { variant: 'success', label: 'Aprobado' }
    return { variant: 'neutral', label: estado }
  }

  const etapaToBadge = (etapa) => {
    if (etapa === 'Formulario Enviado') return { variant: 'success', label: 'Formulario Enviado' }
    if (etapa === 'Prueba Técnica') return { variant: 'info', label: 'Prueba Técnica' }
    if (etapa === 'Entrevista') return { variant: 'purple', label: 'Entrevista' }
    return { variant: 'neutral', label: etapa }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight">Panel de Selección</h1>
        <p className="text-gray-600">Gestiona el Proceso completo de Selección de Practicantes Senati</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card title="Total Postulantes" value={stats.total} icon={Users} color="orange" />
        <Card title="Formularios" value={stats.formularios} icon={FileText} color="blue" />
        <Card title="En Prueba" value={stats.enPrueba} icon={Code2} color="violet" />
        <Card title="Aprobados" value={stats.aprobados} icon={CheckCircle2} color="green" />
      </div>

      <div className="mb-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-2">
              <Input
                className="h-12 rounded-xl bg-white border border-gray-200 shadow-sm"
                placeholder="Buscar por nombre o correo..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="relative">
              <Select
                className="h-12 rounded-xl bg-white border border-gray-200 shadow-sm appearance-none pr-10"
                value={stage}
                onChange={(e) => setStage(e.target.value)}
              >
                {stages.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Select>
              <ChevronDown size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
            </div>
            <div className="relative">
              <Select
                className="h-12 rounded-xl bg-white border border-gray-200 shadow-sm appearance-none pr-10"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Select>
              <ChevronDown size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-[15px]">
        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-600 shadow-sm">Cargando...</div>
        ) : applicants.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-600 shadow-sm">No se encontraron postulantes</div>
        ) : (
          applicants.map((a) => {
            const e = estadoToBadge(a.estado)
            const et = etapaToBadge(a.etapa)
            return (
              <div key={a.id} className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm hover:shadow-md transition overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <IconCircle color="blue">
                    <User size={18} />
                  </IconCircle>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="text-base font-semibold text-gray-900 mr-2 truncate max-w-full">{a.nombre}</div>
                      <Badge variant={e.variant}>{e.label}</Badge>
                      <Badge variant={et.variant}>{et.label}</Badge>
                    </div>
                    <div className="mt-2 text-sm text-gray-600 flex flex-wrap items-center gap-x-6 gap-y-2">
                      <span className="break-all">{a.correo}</span>
                      <span className="hidden sm:inline-block w-px h-4 bg-gray-200" />
                      <span>Desarrollo de Software</span>
                      <span className="hidden sm:inline-block w-px h-4 bg-gray-200" />
                      <span>Ciclo: {a.ciclo}</span>
                      <span className="hidden sm:inline-block w-px h-4 bg-gray-200" />
                      <span>Postulado: {a.fechaPostulacion}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:ml-4 flex-wrap justify-end">
                    <Button variant="light" className="whitespace-nowrap" onClick={() => openDetails(a.id)}>
                      <Eye size={18} className="mr-2" /> Ver Detalles
                    </Button>
                    {a.etapa === 'Formulario Enviado' && (
                      <Button variant="success" className="whitespace-nowrap" onClick={() => openStartTest(a.id)}>
                        <Play size={18} className="mr-2" /> Iniciar Prueba
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      <Modal open={!!detailId} onClose={closeDetails} title="Detalle del Postulante" footer={<Button variant="light" onClick={closeDetails}>Cerrar</Button>}>
        {detailApplicant && (
          <div className="space-y-1 text-sm">
            <div><span className="text-gray-500">Nombre: </span>{detailApplicant.nombre}</div>
            <div><span className="text-gray-500">Correo: </span>{detailApplicant.correo}</div>
            <div><span className="text-gray-500">Estado: </span>{detailApplicant.estado}</div>
            <div><span className="text-gray-500">Etapa: </span>{detailApplicant.etapa}</div>
            <div><span className="text-gray-500">Carrera: </span>{detailApplicant.carrera}</div>
            <div><span className="text-gray-500">Ciclo: </span>{detailApplicant.ciclo}</div>
            <div><span className="text-gray-500">Fecha de postulación: </span>{detailApplicant.fechaPostulacion}</div>
          </div>
        )}
      </Modal>

      <Modal
        open={!!startTestId}
        onClose={closeStartTest}
        title="Iniciar Prueba Técnica"
        footer={(
          <>
            <Button variant="light" onClick={closeStartTest}>Cancelar</Button>
            <Button variant="success" onClick={closeStartTest}>Confirmar</Button>
          </>
        )}
      >
        {startTestApplicant && (
          <p>¿Deseas iniciar la prueba técnica para {startTestApplicant.nombre}?</p>
        )}
      </Modal>
      </div>
    </div>
  )

}
