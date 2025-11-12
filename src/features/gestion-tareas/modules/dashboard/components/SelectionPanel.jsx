import { useMemo } from 'react'
import { Users, FileText, Code2, CheckCircle2, Eye, Play, ChevronDown, User } from 'lucide-react'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { Button } from '../../../components/ui/Button'
import { Modal } from '../../../components/ui/Modal'
import { Card } from '../../../components/ui/Card'
import { Badge } from '../../../components/ui/Badge'
import { IconCircle } from '../../../components/ui/IconCircle'
import { useSelectionPanel } from '../../../hooks/useSelectionPanel'

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
      <div className="w-full">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Panel de Selección</h1>
          <p className="text-sm text-gray-500">Gestiona el Proceso completo de Selección de Practicantes Senati</p>
        </div>
        <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="w-full">
            <Card title="Total Postulantes" value={stats.total} icon={Users} color="orange" className="w-full" />
          </div>
          <div className="w-full">
            <Card title="Formularios" value={stats.formularios} icon={FileText} color="blue" className="w-full" />
          </div>
          <div className="w-full">
            <Card title="En Prueba" value={stats.enPrueba} icon={Code2} color="violet" className="w-full" />
          </div>
          <div className="w-full">
            <Card title="Aprobados" value={stats.aprobados} icon={CheckCircle2} color="green" className="w-full" />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2 mb-2 md:mb-0">
            <div className="rounded-2xl border border-gray-200 bg-white/50 px-3 py-2 shadow-sm">
              <Input
                className="h-12 rounded-xl bg-white border border-gray-200 shadow-sm w-full"
                placeholder="Buscar por nombre o correo..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
          <div>
            <div className="relative rounded-2xl border border-gray-200 bg-white/50 px-3 py-2 shadow-sm">
              <Select
                className="h-12 rounded-xl bg-white border border-gray-200 shadow-sm appearance-none pr-10 w-full"
                value={stage}
                onChange={(e) => setStage(e.target.value)}
              >
                {stages.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Select>
              <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
            </div>
          </div>
          <div>
            <div className="relative rounded-2xl border border-gray-200 bg-white/50 px-3 py-2 shadow-sm">
              <Select
                className="h-12 rounded-xl bg-white border border-gray-200 shadow-sm appearance-none pr-10 w-full"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Select>
              <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Separador dedicado entre filtros y listado */}
      <div className="h-4" />

      <div className="space-y-3">
        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-600 shadow-sm">Cargando...</div>
        ) : applicants.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-600 shadow-sm">No se encontraron postulantes</div>
        ) : (
          applicants.map((a) => {
            const e = estadoToBadge(a.estado)
            const et = etapaToBadge(a.etapa)
            return (
              <div key={a.id} className="rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-200 overflow-hidden">
                <div className="grid grid-cols-1 sm:grid-cols-6 items-center gap-3 sm:gap-0 sm:divide-x sm:divide-gray-200">
                  {/* 1) Identidad (Col 1) */}
                  <div className="flex items-center gap-3 min-w-0 sm:px-4">
                    <IconCircle color="blue">
                      <User size={18} />
                    </IconCircle>
                    <div className="min-w-0">
                      <div className="font-semibold text-gray-800 text-sm md:text-base truncate">{a.nombre}</div>
                      <div className="text-gray-500 text-sm truncate break-all">{a.correo}</div>
                    </div>
                  </div>

                  {/* 2) Estado (Col 2) */}
                  <div className="flex items中心 sm:justify-center sm:px-4">
                    <Badge variant={e.variant}>
                      {e.label}
                    </Badge>
                  </div>

                  {/* 3) Etapa (Col 3) */}
                  <div className="flex items-center sm:justify-center sm:px-4">
                    <Badge variant={et.variant}>
                      {et.label}
                    </Badge>
                  </div>

                  {/* 4) Ciclo (Col 4) */}
                  <div className="flex items-center sm:justify-center text-sm text-gray-500 font-medium sm:px-4">
                    <span>Ciclo: {a.ciclo}</span>
                  </div>

                  {/* 5) Fecha (Col 5) */}
                  <div className="flex items-center sm:justify-center gap-2 sm:px-4">
                    <span className="text-sm text-gray-500 font-medium">{a.fechaPostulacion?.split(' ')[0]}</span>
                  </div>

                  {/* 6) Acciones (Col 6) */}
                  <div className="flex items-center justify-center gap-2 sm:px-4">
                    <Button
                      variant="light"
                      className="h-9 w-9 p-0 rounded-full flex items-center justify-center"
                      onClick={() => openDetails(a.id)}
                      aria-label="Ver detalles"
                    >
                      <Eye size={18} />
                    </Button>
                    <Button
                      variant="success"
                      className="h-9 px-4 rounded-full text-sm font-medium flex items-center gap-2 min-w-[110px] justify-center"
                      onClick={() => openStartTest(a.id)}
                      aria-label="Iniciar prueba"
                    >
                      <Play size={18} />
                      <span>INICIAR</span>
                    </Button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      <Modal open={!!detailId} onClose={closeDetails} title="Detalle del Postulante" containerClassName="w-[520px] h-[700px] max-w-[95vw]" footer={<Button variant="light" onClick={closeDetails}>Cerrar</Button>}>
        {detailApplicant && (
          <div className="h-full flex flex-col md:flex-row md:items-start md:justify-between">
            {/* Columna izquierda: avatar y encabezado */}
            <div className="flex-1 flex items-start gap-4 pr-0 md:pr-6">
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 text-3xl font-bold select-none">
                {(detailApplicant.nombre || '')
                  .split(' ')
                  .slice(0, 2)
                  .map(p => p[0])
                  .join('')}
              </div>
              <div className="min-w-0">
                <div className="text-xl font-semibold text-gray-900 truncate">{detailApplicant.nombre}</div>
                <div className="text-gray-500 break-all">{detailApplicant.correo}</div>
                <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <div className="text-gray-500 text-sm">Nombre</div>
                    <div className="font-medium text-gray-800 truncate">{detailApplicant.nombre}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm">Correo</div>
                    <div className="font-medium text-gray-800 break-all">{detailApplicant.correo}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm">Estado</div>
                    <div className="mt-1">
                      <Badge variant={detailApplicant.estado === 'Aprobado' ? 'success' : detailApplicant.estado === 'En Prueba' ? 'purple' : detailApplicant.estado === 'Pendiente' ? 'warning' : 'neutral'}>
                        {detailApplicant.estado}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-sm">Etapa</div>
                    <div className="mt-1">
                      <Badge variant={detailApplicant.etapa === 'Formulario Enviado' ? 'success' : detailApplicant.etapa === 'Prueba Técnica' ? 'info' : detailApplicant.etapa === 'Entrevista' ? 'purple' : 'neutral'}>
                        {detailApplicant.etapa}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Divisor vertical negro entre columnas en pantallas medianas+ */}
            <div className="hidden md:block w-px bg-black" />

            {/* Columna derecha: datos estructurados sin recuadro */}
            <div className="flex-1 mt-6 md:mt-0 md:pl-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-gray-500 text-sm">Carrera</div>
                  <div className="font-medium text-gray-800">{detailApplicant.carrera}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-sm">Ciclo</div>
                  <div className="font-medium text-gray-800">{detailApplicant.ciclo}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-gray-500 text-sm">Fecha de postulación</div>
                  <div className="font-medium text-gray-800">{detailApplicant.fechaPostulacion}</div>
                </div>
              </div>
            </div>
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
