import { FileText, Users, FileEdit, CheckCircle, Lock } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Modal } from '@shared/components/Modal'
import { DatePicker } from '@shared/components/DatePicker'
import { Input } from '@shared/components/Input'
import { Textarea } from '@shared/components/Textarea'
import { Select } from '@shared/components/Select'
import { Button } from '@shared/components/Button'
import styles from './ConvocatoriaModal.module.css'

export function ConvocatoriaModal({ isOpen, onClose, onSave, convocatoria = null }) {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    fechaInicio: null,
    fechaFin: null,
    cupos: '',
    estado: 'borrador',
  })

  useEffect(() => {
    if (convocatoria) {
      setFormData({
        titulo: convocatoria.titulo || convocatoria._apiData?.title || '',
        descripcion: convocatoria.descripcion || convocatoria._apiData?.description || '',
        fechaInicio: convocatoria.fechaInicioDate || (convocatoria._apiData?.start_date ? new Date(convocatoria._apiData.start_date) : null),
        fechaFin: convocatoria.fechaFinDate || (convocatoria._apiData?.end_date ? new Date(convocatoria._apiData.end_date) : null),
        cupos: convocatoria.cupos || '',
        estado: convocatoria.estado || convocatoria._apiData?.status || 'borrador',
      })
    } else {
      setFormData({
        titulo: '',
        descripcion: '',
        fechaInicio: null,
        fechaFin: null,
        cupos: '',
        estado: 'borrador',
      })
    }
  }, [convocatoria, isOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (name, date) => {
    setFormData(prev => ({ ...prev, [name]: date }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={convocatoria ? 'Editar Convocatoria' : 'Nueva Convocatoria'}
      size="md"
    >
      <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Título"
            id="titulo"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            placeholder="Ej: Convocatoria Enero 2024"
            icon={FileText}
            iconPosition="left"
            required
          />

          <Textarea
            label="Descripción"
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Describe el proceso de selección..."
            rows={3}
            required
          />

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="fechaInicio" className={styles.label}>
                Fecha Inicio *
              </label>
              <DatePicker
                selected={formData.fechaInicio}
                onChange={(date) => handleDateChange('fechaInicio', date)}
                placeholder="Seleccionar fecha de inicio"
                minDate={new Date()}
                maxDate={formData.fechaFin}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="fechaFin" className={styles.label}>
                Fecha Fin *
              </label>
              <DatePicker
                selected={formData.fechaFin}
                onChange={(date) => handleDateChange('fechaFin', date)}
                placeholder="Seleccionar fecha de fin"
                minDate={formData.fechaInicio || new Date()}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <Input
              label="Cupos"
              type="number"
              id="cupos"
              name="cupos"
              value={formData.cupos}
              onChange={handleChange}
              placeholder="Ej: 10"
              icon={Users}
              iconPosition="left"
              min="1"
              required
            />

            <Select
              label="Estado"
              id="estado"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              options={[
                { value: 'borrador', label: 'Borrador', Icon: FileEdit },
                { value: 'abierta', label: 'Abierta', Icon: CheckCircle },
                { value: 'cerrada', label: 'Cerrada', Icon: Lock },
                { value: 'finalizada', label: 'Finalizada', Icon: Lock },
              ]}
            />
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              fullWidth
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              fullWidth
            >
              {convocatoria ? 'Guardar Cambios' : 'Crear Convocatoria'}
            </Button>
          </div>
        </form>
    </Modal>
  )
}

