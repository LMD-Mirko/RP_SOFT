import { useState } from 'react'
import { Form, FormField } from '../ui/Form'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'

const PRIORIDADES = ['Alta', 'Media', 'Baja']
const ESTADOS = ['Pendiente', 'En Proceso', 'Completado']

export function TaskForm({ initialValue, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    titulo: initialValue?.titulo || '',
    descripcion: initialValue?.descripcion || '',
    equipo: initialValue?.equipo || '',
    prioridad: initialValue?.prioridad || 'Media',
    hasta: initialValue?.hasta || '',
    estado: initialValue?.estado || 'Pendiente',
    tags: (initialValue?.tags || []).join(', '),
  })

  const handleChange = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const submit = () => {
    const payload = {
      ...form,
      tags: form.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
    }
    onSubmit?.(payload)
  }

  return (
    <Form onSubmit={submit}>
      <FormField label="Título" required>
        <Input value={form.titulo} onChange={handleChange('titulo')} placeholder="Ingresa el título" />
      </FormField>

      <FormField label="Descripción">
        <Input value={form.descripcion} onChange={handleChange('descripcion')} placeholder="Ingresa la descripción" />
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <FormField label="Equipo">
          <Input value={form.equipo} onChange={handleChange('equipo')} placeholder="Equipo" />
        </FormField>
        <FormField label="Prioridad">
          <Select value={form.prioridad} onChange={handleChange('prioridad')} className="h-10">
            {PRIORIDADES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </Select>
        </FormField>
        <FormField label="Estado">
          <Select value={form.estado} onChange={handleChange('estado')} className="h-10">
            {ESTADOS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormField label="Hasta cuándo">
          <Input type="text" value={form.hasta} onChange={handleChange('hasta')} placeholder="dd/mm/aaaa" />
        </FormField>
        <FormField label="Tags (separados por coma)">
          <Input value={form.tags} onChange={handleChange('tags')} placeholder="React, API REST" />
        </FormField>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="light" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" variant="primary">Guardar</Button>
      </div>
    </Form>
  )
}
