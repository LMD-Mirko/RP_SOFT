import { useState } from 'react'
import { Form, FormField } from '../ui/Form'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'

export function TeamForm({ initialValue, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    nombre: initialValue?.nombre || '',
    descripcion: initialValue?.descripcion || '',
    miembros: (initialValue?.miembros || []).join(', '),
    totalTareas: initialValue?.totalTareas ?? 0,
    progreso: initialValue?.progreso ?? 0,
  })

  const handle = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = () => {
    const payload = {
      nombre: form.nombre,
      descripcion: form.descripcion,
      miembros: form.miembros
        .split(',')
        .map((m) => m.trim())
        .filter(Boolean),
      totalTareas: Number(form.totalTareas) || 0,
      progreso: Math.max(0, Math.min(100, Number(form.progreso) || 0)),
    }
    onSubmit?.(payload)
  }

  return (
    <Form onSubmit={submit}>
      <FormField label="Nombre" required>
        <Input value={form.nombre} onChange={handle('nombre')} placeholder="Nombre del equipo" />
      </FormField>
      <FormField label="Descripción">
        <Input value={form.descripcion} onChange={handle('descripcion')} placeholder="Descripción corta" />
      </FormField>
      <FormField label="Miembros (separados por coma)">
        <Input value={form.miembros} onChange={handle('miembros')} placeholder="Juan, Ana, ..." />
      </FormField>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormField label="Total de Tareas">
          <Input type="number" value={form.totalTareas} onChange={handle('totalTareas')} />
        </FormField>
        <FormField label="Progreso (%)">
          <Input type="number" value={form.progreso} onChange={handle('progreso')} />
        </FormField>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="light" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" variant="primary">Guardar</Button>
      </div>
    </Form>
  )
}
