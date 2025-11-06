import { useEffect, useMemo, useRef, useState } from 'react'
import { Plus, Share2, Ellipsis, Timer, Gauge, Users as UsersIcon, CheckCircle2, Pencil, Trash2, X } from 'lucide-react'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Avatar } from '../ui/Avatar'
import { Progress } from '../ui/Progress'
import { Modal } from '../ui/Modal'
import { useSprintBoard } from '../../hooks/useSprintBoard'

function ColumnCard({ card, columnId, onEdit, onDelete, onMoveWithin, onHoverWithin, onHoverLeave, dense }) {
  const labelColor = (t) => {
    if (/prioridad/i.test(t)) return 'bg-red-600 text-white'
    if (/seguridad/i.test(t)) return 'bg-fuchsia-600 text-white'
    if (/back/i.test(t)) return 'bg-amber-600 text-white'
    if (/front/i.test(t)) return 'bg-blue-600 text-white'
    if (/base de datos/i.test(t)) return 'bg-emerald-600 text-white'
    if (/diseñ|disen/i.test(t)) return 'bg-violet-600 text-white'
    return 'bg-gray-700 text-white'
  }
  const orderedTags = Array.isArray(card.tags)
    ? [...card.tags].sort((a, b) => {
        const w = (t) => (/prioridad/i.test(t) ? 0 : /seguridad/i.test(t) ? 1 : /back/i.test(t) ? 2 : /front/i.test(t) ? 3 : 4)
        return w(a) - w(b)
      })
    : []
  return (
    <div
      role="listitem"
      aria-label={`${card.id} - ${card.titulo}`}
      className={`rounded-2xl border border-gray-100 bg-white ${dense ? 'p-5' : 'p-6'} shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/card-id', card.id)
        e.dataTransfer.setData('text/from-col', columnId)
      }}
      onDragOver={(e) => {
        e.preventDefault()
        onHoverWithin?.(columnId, card.id)
      }}
      onDrop={(e) => {
        const draggedId = e.dataTransfer.getData('text/card-id')
        const fromCol = e.dataTransfer.getData('text/from-col')
        if (draggedId && fromCol === columnId && draggedId !== card.id) {
          onMoveWithin?.(columnId, draggedId, card.id)
        }
      }}
      onDragLeave={() => onHoverLeave?.()}
    >
      <div className="flex flex-wrap items-center gap-2.5 mb-4">
        {orderedTags.map((t) => (
          <span key={t} className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${labelColor(t)}`}>{t}</span>
        ))}
      </div>
      <h4 className={`${dense ? 'text-[clamp(13px,1.6vw,15px)] leading-6' : 'text-[16px] leading-7'} font-semibold text-gray-900 mb-3 line-clamp-2`}>{card.id} - {card.titulo}</h4>
      <div className={`flex items-center justify-between ${dense ? 'text-[12px]' : 'text-[13px]'} text-gray-600`}>
        <span className="inline-flex items-center gap-2"><CheckCircle2 size={16} /> {card.puntos} pts</span>
        <span className="inline-flex items-center gap-2">
          <button
            className={`${dense ? 'h-8 w-8' : 'h-8 w-8'} inline-flex items-center justify-center rounded-md hover:bg-gray-50 text-gray-600 whitespace-nowrap focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2`}
            title="Editar"
            aria-label="Editar tarjeta"
            onClick={() => onEdit?.(columnId, card)}
          >
            <Pencil size={16} />
          </button>
          <button
            className={`${dense ? 'h-8 w-8' : 'h-8 w-8'} inline-flex items-center justify-center rounded-md hover:bg-rose-50 text-rose-600 whitespace-nowrap focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2`}
            title="Eliminar"
            aria-label="Eliminar tarjeta"
            onClick={() => onDelete?.(columnId, card)}
          >
            <Trash2 size={16} />
          </button>
          <Avatar initials={card.owner} />
        </span>
      </div>
      <div className={`${dense ? 'mt-4' : 'mt-5'}`}>
        <Progress value={card.progreso?.done || 0} max={card.progreso?.total || 1} color="violet" className={dense ? 'h-2' : 'h-2.5'} />
        <div className="mt-1.5 text-xs text-gray-500">{card.progreso?.done ?? 0}/{card.progreso?.total ?? 0}</div>
      </div>
      {card.fecha || (card.checklist && card.checklist.length > 0) ? (
        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <span>{card.fecha ? new Date(card.fecha).toLocaleDateString() : ''}</span>
          {Array.isArray(card.checklist) ? (
            <span>
              {(card.checklist.filter(i => i.done).length)}/{card.checklist.length} checklist
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

function Column({ column, members, onAdd, onMove, onEdit, onDelete, forceOpen = false, onOpened, filters, dense }) {
  const [showForm, setShowForm] = useState(false)
  const [titulo, setTitulo] = useState('')
  const [puntos, setPuntos] = useState('')
  const [tags, setTags] = useState('')
  const [owner, setOwner] = useState('')
  const [isOver, setIsOver] = useState(false)
  const [hoverTargetId, setHoverTargetId] = useState(null)
  const [quickTitle, setQuickTitle] = useState('')

  useEffect(() => {
    if (forceOpen) {
      setShowForm(true)
      onOpened && onOpened()
    }
  }, [forceOpen, onOpened])

  function handleCreate() {
    if (!titulo.trim()) return
    const id = `HU${Math.floor(Date.now() / 1000).toString().slice(-4)}`
    const payload = {
      id,
      titulo: titulo.trim(),
      puntos: Number(puntos || 0),
      tags: tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean),
      progreso: { done: 0, total: 17 },
      owner: owner || members?.[0]?.iniciales || 'NA',
    }
    onAdd?.(column.id, payload)
    setTitulo('')
    setPuntos('')
    setTags('')
    setOwner('')
    setShowForm(false)
  }

  return (
    <div className="flex h-full flex-col gap-5">
      <div className={`sticky top-0 z-10 flex items-center justify-between bg-gray-50/95 backdrop-blur supports-[backdrop-filter]:backdrop-blur border border-gray-200 rounded-2xl ${dense ? 'px-5 py-3.5' : 'px-6 py-4'}`}>
        <div className="flex items-center gap-2">
          <button
            type="button"
            title="Reordenar columna"
            aria-label={`Reordenar columna ${column.titulo}`}
            className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-gray-100 cursor-grab focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('text/col-id', column.id)
            }}
          >
            ≡
          </button>
          <h3 className="text-[clamp(11px,1.2vw,12px)] font-semibold tracking-wide uppercase text-gray-700">{column.titulo}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center h-6 min-w-[1.5rem] rounded-full bg-gray-100 px-2 text-[11px] font-medium text-gray-700">{column.cards?.length ?? 0}</span>
          <button
            className={`${dense ? 'h-8 w-8' : 'h-8 w-8'} inline-flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100 text-gray-600 whitespace-nowrap focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2`}
            aria-label="Opciones de columna"
            onClick={() => {
              const action = window.prompt('Acción: renombrar / eliminar', 'renombrar')
              if (!action) return
              if (/eliminar/i.test(action)) {
                onDelete?.('column', { id: column.id, titulo: column.titulo })
              } else if (/renombrar/i.test(action)) {
                const name = window.prompt('Nuevo nombre de la columna', column.titulo)
                if (name != null) {
                  onEdit?.('column', { id: column.id, titulo: name })
                }
              }
            }}
          >
            <Ellipsis size={18} />
          </button>
          <button
            title="Eliminar columna"
            aria-label={`Eliminar columna ${column.titulo}`}
            className="h-8 w-8 inline-flex items-center justify-center rounded-full border border-gray-200 hover:bg-rose-50 text-rose-600 focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
            onClick={() => onDelete?.('column', { id: column.id, titulo: column.titulo })}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      <div
        role="list"
        aria-label={`Tarjetas en ${column.titulo}`}
        className={`flex-1 ${dense ? 'space-y-5' : 'space-y-6'} overflow-y-auto pr-4 scroll-pt-3 scroll-pb-8 ${isOver ? 'bg-blue-50/40' : ''}`}
        onDragOver={(e) => {
          e.preventDefault()
          setIsOver(true)
          // Auto-scroll vertical dentro de la columna durante drag
          const el = e.currentTarget
          const rect = el.getBoundingClientRect()
          const threshold = 60
          if (e.clientY - rect.top < threshold) {
            el.scrollTop -= 20
          } else if (rect.bottom - e.clientY < threshold) {
            el.scrollTop += 20
          }
        }}
        onDragLeave={() => setIsOver(false)}
        onDrop={(e) => {
          e.stopPropagation()
          const cardId = e.dataTransfer.getData('text/card-id')
          const fromCol = e.dataTransfer.getData('text/from-col')
          setIsOver(false)
          if (cardId && fromCol && fromCol !== column.id) {
            onMove?.between?.(fromCol, column.id, cardId)
          }
        }}
      >
        {/* Quick Add */}
        <input
          type="text"
          value={quickTitle}
          onChange={(e) => setQuickTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && quickTitle.trim()) {
              onAdd?.(column.id, { id: `HU${Date.now().toString().slice(-4)}`, titulo: quickTitle.trim(), puntos: 0, tags: [], progreso: { done: 0, total: 17 } })
              setQuickTitle('')
            }
          }}
          placeholder="Añadir tarjeta rápidamente y Enter"
          className={`w-full h-10 rounded-lg border border-gray-300 bg-white px-4 text-sm placeholder:text-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500`}
        />
        {showForm && (
          <div className={`rounded-2xl border border-gray-200 bg-white ${dense ? 'p-4' : 'p-5'} shadow-sm`}>
            <div className="space-y-3">
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Título de la tarjeta"
                className={`w-full h-10 rounded-lg border border-gray-300 bg-white px-4 text-sm placeholder:text-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500`}
              />
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="0"
                  value={puntos}
                  onChange={(e) => setPuntos(e.target.value)}
                  placeholder="Puntos"
                  className={`w-28 h-10 rounded-lg border border-gray-300 bg-white px-4 text-sm placeholder:text-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500`}
                />
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Tags (coma separada)"
                  className={`flex-1 h-10 rounded-lg border border-gray-300 bg-white px-4 text-sm placeholder:text-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500`}
                />
                <select
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  className={`w-36 h-10 rounded-lg border border-gray-300 bg-white px-4 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500`}
                >
                  <option value="">Asignar</option>
                  {members?.map((m) => (
                    <option key={m.id} value={m.iniciales}>{m.iniciales}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={handleCreate} className={`h-9 px-4 whitespace-nowrap focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2`}>Crear</Button>
                <Button variant="light" onClick={() => setShowForm(false)} className={`h-9 px-4 whitespace-nowrap focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2`}>Cancelar</Button>
              </div>
            </div>
          </div>
        )}
        {/* Placeholder de posición */}
        {column.cards
          .filter((c) => {
            if (!filters) return true
            const textOk = !filters.q || (c.titulo || '').toLowerCase().includes(filters.q)
            const ownerOk = !filters.owner || c.owner === filters.owner
            const tagOk = !filters.tag || (Array.isArray(c.tags) && c.tags.some(t => t.toLowerCase() === filters.tag))
            return textOk && ownerOk && tagOk
          })
          .map((c) => (
            <div key={c.id + c.titulo}>
              {hoverTargetId === c.id ? (
                <div className="h-2 rounded bg-blue-400/60 my-2" />
              ) : null}
              <ColumnCard
                card={c}
                columnId={column.id}
                onEdit={onEdit}
                onDelete={onDelete}
                onMoveWithin={onMove?.within}
                onHoverWithin={(_, __) => setHoverTargetId(c.id)}
                onHoverLeave={() => setHoverTargetId(null)}
                dense={dense}
              />
            </div>
        ))}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className={`inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 ${dense ? 'py-2 px-2.5' : 'py-2.5 px-3'} rounded-md hover:bg-gray-50 whitespace-nowrap focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2`}
          >
            <Plus size={18} /> Añadir Tarjeta
          </button>
        )}
      </div>
    </div>
  )
}

export function SprintBoard() {
  const { loading, stats, columns, members, addCard, moveCard, moveCardWithin, updateCard, deleteCard, addColumn, renameColumn, deleteColumn, moveColumn } = useSprintBoard()
  const [openColumnId, setOpenColumnId] = useState(null)
  const [editing, setEditing] = useState(null)
  const [confirmDlg, setConfirmDlg] = useState(null)
  const scrollerRef = useRef(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(false)

  const presetLabels = ['Prioridad Alta', 'Back-End', 'Front-End', 'Seguridad', 'Base de Datos', 'Diseño']
  const [q, setQ] = useState('')
  const [ownerFilter, setOwnerFilter] = useState('')
  const [tagFilter, setTagFilter] = useState('')

  const dense = useMemo(() => {
    try {
      const longest = Math.max(
        0,
        ...[...(columns || []).flatMap(c => (c.cards || []).map(k => (k.titulo || '').length))]
      )
      return longest > 48
    } catch (_) {
      return false
    }
  }, [columns])

  function closeModal() {
    setEditing(null)
  }

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    const update = () => {
      setCanLeft(el.scrollLeft > 4)
      setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
    }
    update()
    el.addEventListener('scroll', update, { passive: true })
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', update)
      ro.disconnect()
    }
  }, [])

  function scrollByDir(dir) {
    const el = scrollerRef.current
    if (!el) return
    const delta = Math.round(el.clientWidth * 0.8) * (dir === 'left' ? -1 : 1)
    el.scrollBy({ left: delta, behavior: 'smooth' })
  }

  function handleDragOverScroll(e) {
    const el = scrollerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const threshold = 60
    if (e.clientX - rect.left < threshold) {
      el.scrollLeft -= 20
    } else if (rect.right - e.clientX < threshold) {
      el.scrollLeft += 20
    }
  }

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
        <div className="mx-auto max-w-7xl rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-600 shadow-sm">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="px-6 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 pt-28 md:pt-32 pb-16 bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-[1400px] lg:pl-28 xl:pl-36">
        <div className="mt-2 mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="min-w-0 pl-1 sm:pl-2">
            <div className="flex items-center gap-3">
              <h1 className="text-[clamp(28px,3.4vw,36px)] leading-[clamp(32px,3.8vw,42px)] font-extrabold tracking-tight truncate">Sprint Board</h1>
              <Badge variant="success">{stats.estado}</Badge>
            </div>
            <p className="text-gray-600 mt-2 truncate">{stats.nombre}</p>
          </div>
          <div className="flex flex-row flex-wrap items-center gap-3 sm:gap-4 md:gap-5 pr-1 sm:pr-2">
            <div className="flex -space-x-2">
              {members.map((m) => (
                <Avatar key={m.id} initials={m.iniciales} color={m.color} className="ring-2 ring-white shadow-sm" />
              ))}
              <Button variant="light" className="h-10 px-4 whitespace-nowrap" aria-label="Añadir miembro">+</Button>
            </div>
            <Button variant="light" className="h-10 px-4 whitespace-nowrap"><Share2 size={18} className="mr-2" /> Compartir</Button>
            <Button
              variant="dark"
              onClick={() => setOpenColumnId(columns?.[0]?.id || null)}
            >
              <Plus size={18} className="mr-2" /> Agregar Tarea
            </Button>
            <Button variant="secondary" onClick={() => addColumn('Nueva columna')} className="h-10 px-4 whitespace-nowrap">+ Columna</Button>
          </div>
        </div>

        {/* Filtros */}
        <div className="mt-8 mb-12 grid grid-cols-1 sm:grid-cols-3 gap-5 pl-1 sm:pl-2 pr-1 sm:pr-2">
          <input value={q} onChange={(e) => setQ(e.target.value.toLowerCase())} placeholder="Buscar por texto" className="h-10 rounded-lg border border-gray-300 px-4 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500" />
          <select value={ownerFilter} onChange={(e) => setOwnerFilter(e.target.value)} className="h-10 rounded-lg border border-gray-300 px-4 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
            <option value="">Owner</option>
            {members.map(m => <option key={m.id} value={m.iniciales}>{m.iniciales}</option>)}
          </select>
          <select value={tagFilter} onChange={(e) => setTagFilter(e.target.value)} className="h-10 rounded-lg border border-gray-300 px-4 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
            <option value="">Etiqueta</option>
            {presetLabels.map(t => <option key={t} value={t.toLowerCase()}>{t}</option>)}
          </select>
        </div>

        <div className={`${dense ? 'gap-10' : 'gap-12'} grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-14 md:mb-16`}>
          <Card title="Duración" value={stats.duracion} icon={Timer} color="gray" />
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-2">
              <div className="text-sm text-gray-500">Puntos del Sprint</div>
              <div className="mt-1 text-2xl font-semibold text-rose-600">{stats.puntosHechos}/{stats.puntosTotales}</div>
            </div>
            <Progress value={stats.puntosHechos} max={stats.puntosTotales} color="orange" className="h-2" />
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="text-sm text-gray-500">Velocidad</div>
            <div className="mt-1 text-2xl font-semibold text-emerald-600 flex items-center gap-2"><Gauge size={20} /> {stats.velocidad} pts/día</div>
            <div className="text-xs text-emerald-600">{stats.tendencia}</div>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="text-sm text-gray-500">Equipo</div>
            <div className="mt-1 text-2xl font-semibold text-violet-600 flex items-center gap-2"><UsersIcon size={20} /> {stats.equipo} miembros</div>
            <div className="text-xs text-gray-500">Todos activos</div>
          </div>
        </div>

        <div className="relative group mt-2">
          {/* Botón izquierda */}
          {canLeft && (
            <button
              type="button"
              className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow border border-gray-200 group-hover:opacity-100"
              onClick={() => scrollByDir('left')}
            >
              ‹
            </button>
          )}
          {/* Sombra izquierda */}
          {canLeft && (
            <div className="pointer-events-none absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-white/90 to-transparent" />
          )}
          {/* Botón derecha */}
          {canRight && (
            <button
              type="button"
              className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow border border-gray-200 group-hover:opacity-100"
              onClick={() => scrollByDir('right')}
            >
              ›
            </button>
          )}
          {/* Sombra derecha */}
          {canRight && (
            <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-white/90 to-transparent" />
          )}
          <div
            ref={scrollerRef}
            className="overflow-x-auto pb-2 snap-x snap-mandatory snap-always"
            onDragOver={handleDragOverScroll}
          >
            <div className={`flex ${dense ? 'gap-9' : 'gap-12'} px-8 sm:px-12 lg:px-14`} role="list" aria-label="Columnas del sprint">
              {/* Spacer inicial para snap y padding visual */}
              <div className="shrink-0 w-2 snap-start" />
              {columns.map((col) => (
                <div
                  key={col.id}
                  role="listitem"
                  aria-label={`Columna ${col.titulo}`}
                  className={`shrink-0 ${dense ? 'w-[360px]' : 'w-[380px]'} snap-start rounded-2xl border border-gray-100 bg-white ${dense ? 'p-6' : 'p-6'} shadow-sm min-h-[560px] h-full`}
                >
                  <Column
                    column={col}
                    members={members}
                    onAdd={addCard}
                    onMove={{
                      between: moveCard,
                      within: (colId, draggedId, targetId) => moveCardWithin(colId, draggedId, targetId),
                    }}
                    onEdit={(columnId, card) => setEditing({ columnId, card })}
                    onDelete={(columnId, card) => {
                      if (columnId === 'column') {
                        setConfirmDlg({
                          title: 'Eliminar columna',
                          message: `¿Seguro que deseas eliminar la columna "${card.titulo}"? Esta acción no se puede deshacer.`,
                          onConfirm: () => deleteColumn(card.id),
                        })
                        return
                      }
                      setConfirmDlg({
                        title: 'Eliminar tarjeta',
                        message: `¿Seguro que deseas eliminar la tarjeta "${card.titulo}"? Esta acción no se puede deshacer.`,
                        onConfirm: () => deleteCard(columnId, card.id),
                      })
                    }}
                    forceOpen={openColumnId === col.id}
                    onOpened={() => setOpenColumnId(null)}
                    filters={{ q, owner: ownerFilter, tag: tagFilter }}
                    dense={dense}
                  />
                </div>
              ))}
              {/* Spacer final para snap y padding visual */}
              <div className="shrink-0 w-2 snap-start" />
            </div>
          </div>
        </div>

        <Modal open={!!editing} onClose={closeModal} title="Editar tarjeta">
          {editing && (
            <EditForm
              card={editing.card}
              members={members}
              presetLabels={presetLabels}
              onCancel={closeModal}
              onSave={(payload) => {
                updateCard(editing.columnId, editing.card.id, payload)
                closeModal()
              }}
            />
          )}
        </Modal>

        {/* Confirmación eliminar */}
        <Modal
          open={!!confirmDlg}
          onClose={() => setConfirmDlg(null)}
          title={confirmDlg?.title}
          footer={(
            <>
              <Button variant="light" className="h-9 px-4" onClick={() => setConfirmDlg(null)}>Cancelar</Button>
              <Button className="h-9 px-4 bg-rose-600 hover:bg-rose-700 text-white" onClick={() => { confirmDlg?.onConfirm?.(); setConfirmDlg(null) }}>Eliminar</Button>
            </>
          )}
        >
          <p className="text-sm text-gray-600">{confirmDlg?.message}</p>
        </Modal>
      </div>
    </div>
  )
}

function EditForm({ card, members, presetLabels, onSave, onCancel }) {
  const [titulo, setTitulo] = useState(card.titulo || '')
  const [puntos, setPuntos] = useState(card.puntos || 0)
  const [owner, setOwner] = useState(card.owner || (members?.[0]?.iniciales || 'NA'))
  const [tags, setTags] = useState(Array.isArray(card.tags) ? card.tags : [])
  const [fecha, setFecha] = useState(card.fecha ? card.fecha.substring(0,10) : '')
  const [checklist, setChecklist] = useState(Array.isArray(card.checklist) ? card.checklist : [])
  const [newItem, setNewItem] = useState('')

  function toggleTag(tag) {
    setTags((prev) => (prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]))
  }
  function addItem() {
    const t = newItem.trim()
    if (!t) return
    setChecklist((prev) => [...prev, { id: 'i' + Date.now(), text: t, done: false }])
    setNewItem('')
  }
  function toggleItem(id) {
    setChecklist((prev) => prev.map(i => i.id === id ? { ...i, done: !i.done } : i))
  }
  function removeItem(id) {
    setChecklist((prev) => prev.filter(i => i.id !== id))
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm text-gray-600">Título</label>
        <input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <label className="text-sm text-gray-600">Puntos</label>
          <input type="number" min="0" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" value={puntos} onChange={(e) => setPuntos(Number(e.target.value || 0))} />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-gray-600">Responsable</label>
          <select className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" value={owner} onChange={(e) => setOwner(e.target.value)}>
            {members?.map((m) => (
              <option key={m.id} value={m.iniciales}>{m.iniciales}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm text-gray-600">Etiquetas</label>
        <div className="flex flex-wrap gap-2">
          {presetLabels.map((t) => (
            <button key={t} type="button" onClick={() => toggleTag(t)} className={`px-3 py-1 rounded-full text-xs font-medium border ${tags.includes(t) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300'}`}>{t}</button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm text-gray-600">Fecha</label>
        <input type="date" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" value={fecha} onChange={(e) => setFecha(e.target.value)} />
      </div>
      <div className="space-y-2">
        <label className="text-sm text-gray-600">Checklist</label>
        <div className="space-y-2">
          {checklist.map(i => (
            <div key={i.id} className="flex items-center gap-2">
              <input type="checkbox" checked={!!i.done} onChange={() => toggleItem(i.id)} />
              <span className={`text-sm ${i.done ? 'line-through text-gray-400' : ''}`}>{i.text}</span>
              <button className="ml-auto text-xs text-rose-600 hover:underline" onClick={() => removeItem(i.id)}>Eliminar</button>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <input className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" value={newItem} onChange={(e) => setNewItem(e.target.value)} placeholder="Nueva tarea" />
            <Button className="h-9 px-3" onClick={addItem}>Añadir</Button>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end gap-2 pt-2">
        <Button variant="light" className="h-9 px-4" onClick={onCancel}>Cancelar</Button>
        <Button className="h-9 px-4" onClick={() => onSave({ titulo, puntos, owner, tags, fecha, checklist })}>Guardar</Button>
      </div>
    </div>
  )
}
