import { FileText, Users, FileEdit, CheckCircle, Lock } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { Modal } from '@shared/components/Modal'
import { Input } from '@shared/components/Input'
import { Textarea } from '@shared/components/Textarea'
import { Select } from '@shared/components/Select'
import { Button } from '@shared/components/Button'
import { PopoverCalendar, parsePartialDate } from '@shared/components/Calendar/CustomCalendar'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)
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

  const [openFechaInicio, setOpenFechaInicio] = useState(false)
  const [openFechaFin, setOpenFechaFin] = useState(false)
  const inicioBtnRef = useRef(null)
  const finBtnRef = useRef(null)
  const [inputFechaInicio, setInputFechaInicio] = useState('')
  const [inputFechaFin, setInputFechaFin] = useState('')
  const [previewFechaInicio, setPreviewFechaInicio] = useState(null)
  const [previewFechaFin, setPreviewFechaFin] = useState(null)

  useEffect(() => {
    setInputFechaInicio(formData.fechaInicio ? dayjs(formData.fechaInicio).format('DD-MM-YYYY') : '')
    setInputFechaFin(formData.fechaFin ? dayjs(formData.fechaFin).format('DD-MM-YYYY') : '')
  }, [formData.fechaInicio, formData.fechaFin])

  const handleInputFechaInicioBlur = () => {
    if (!inputFechaInicio) {
      handleDateChange('fechaInicio', null)
      return
    }
    const parsed = dayjs(inputFechaInicio, 'DD-MM-YYYY', true)
    if (parsed.isValid()) handleDateChange('fechaInicio', parsed.toDate())
  }

  const handleInputFechaInicioChange = (val) => {
    setInputFechaInicio(val)
    const p = parsePartialDate(val)
    setPreviewFechaInicio(p)
  }

  const handleInputFechaFinBlur = () => {
    if (!inputFechaFin) {
      handleDateChange('fechaFin', null)
      return
    }
    const parsed = dayjs(inputFechaFin, 'DD-MM-YYYY', true)
    if (parsed.isValid()) handleDateChange('fechaFin', parsed.toDate())
  }

  const handleInputFechaFinChange = (val) => {
    setInputFechaFin(val)
    const p = parsePartialDate(val)
    setPreviewFechaFin(p)
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
              <Input
                id="fechaInicio"
                placeholder="DD-MM-YYYY"
                value={inputFechaInicio}
                onChange={(e) => handleInputFechaInicioChange(e.target.value)}
                onBlur={handleInputFechaInicioBlur}
                onFocus={() => setOpenFechaInicio(true)}
                ref={inicioBtnRef}
                style={{ backgroundColor: '#fbfdff', color: '#0f172a', borderColor: '#eef2ff' }}
              />
              <PopoverCalendar
                open={openFechaInicio}
                anchorEl={inicioBtnRef.current}
                initialValue={previewFechaInicio ?? (formData.fechaInicio ? dayjs(formData.fechaInicio) : null)}
                onClose={() => setOpenFechaInicio(false)}
                onSelect={(d) => {
                  handleDateChange('fechaInicio', d ? d.toDate() : null)
                  setInputFechaInicio(d ? d.format('DD-MM-YYYY') : '')
                  setPreviewFechaInicio(null)
                }}
                title="Fecha Inicio"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="fechaFin" className={styles.label}>
                Fecha Fin *
              </label>
              <Input
                id="fechaFin"
                placeholder="DD-MM-YYYY"
                value={inputFechaFin}
                onChange={(e) => handleInputFechaFinChange(e.target.value)}
                onBlur={handleInputFechaFinBlur}
                onFocus={() => setOpenFechaFin(true)}
                ref={finBtnRef}
                style={{ backgroundColor: '#fbfdff', color: '#0f172a', borderColor: '#eef2ff' }}
              />
              <PopoverCalendar
                open={openFechaFin}
                anchorEl={finBtnRef.current}
                initialValue={previewFechaFin ?? (formData.fechaFin ? dayjs(formData.fechaFin) : null)}
                onClose={() => setOpenFechaFin(false)}
                onSelect={(d) => {
                  handleDateChange('fechaFin', d ? d.toDate() : null)
                  setInputFechaFin(d ? d.format('DD-MM-YYYY') : '')
                  setPreviewFechaFin(null)
                }}
                title="Fecha Fin"
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

