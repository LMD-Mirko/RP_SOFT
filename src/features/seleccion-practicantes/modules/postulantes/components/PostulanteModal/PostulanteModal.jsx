import { useState, useEffect, useRef } from 'react'
import { User, Mail, FileText, Calendar, CreditCard, Phone, MapPin, Cake } from 'lucide-react'
import { Modal } from '@shared/components/Modal'
import { Input } from '@shared/components/Input'
import { Select } from '@shared/components/Select'
import { Button } from '@shared/components/Button'
import { PopoverCalendar, parsePartialDate } from '@shared/components/Calendar/CustomCalendar'
import dayjs from 'dayjs'
import styles from './PostulanteModal.module.css'
            <Input
              id="fechaNacimiento"
              placeholder="DD-MM-YYYY"
              value={inputFechaNacimiento}
              onChange={(e) => handleInputFechaNacimientoChange(e.target.value)}
              onBlur={handleInputFechaNacimientoBlur}
              onFocus={() => setOpenFechaNacimiento(true)}
              ref={btnFechaNacimientoRef}
              icon={Cake}
              style={{ backgroundColor: '#fbfdff', color: '#0f172a', borderColor: '#eef2ff' }}
            />
            <PopoverCalendar
              open={openFechaNacimiento}
              anchorEl={btnFechaNacimientoRef.current}
              initialValue={previewFechaNacimiento ?? (formData.fechaNacimiento ? dayjs(formData.fechaNacimiento) : null)}
              onClose={() => setOpenFechaNacimiento(false)}
              onSelect={(d) => {
                const date = d ? d.toDate() : null
                handleDateNacimientoChange(date)
                setInputFechaNacimiento(d ? d.format('DD-MM-YYYY') : '')
                setPreviewFechaNacimiento(null)
              }}
              title="Fecha de Nacimiento"
            />
    telefono: '',
    direccion: '',
    fechaNacimiento: null,
    etapa: '',
    estado: '',
    fecha: null,
            <Input
              id="fechaRegistro"
              placeholder="DD-MM-YYYY"
              value={inputFechaRegistro}
              onChange={(e) => handleInputFechaRegistroChange(e.target.value)}
              onBlur={handleInputFechaRegistroBlur}
              onFocus={() => setOpenFecha(true)}
              ref={btnFechaRef}
              icon={Calendar}
              style={{ backgroundColor: '#fbfdff', color: '#0f172a', borderColor: '#eef2ff' }}
            />
            <PopoverCalendar
              open={openFecha}
              anchorEl={btnFechaRef.current}
              initialValue={previewFechaRegistro ?? (formData.fecha ? dayjs(formData.fecha) : null)}
              onClose={() => setOpenFecha(false)}
              onSelect={(d) => {
                const date = d ? d.toDate() : null
                handleDateChange(date)
                setInputFechaRegistro(d ? d.format('DD-MM-YYYY') : '')
                setPreviewFechaRegistro(null)
              }}
              title="Fecha de Registro"
            />
        dni: '',
        telefono: '',
        direccion: '',
        fechaNacimiento: null,
        etapa: '',
        estado: '',
        fecha: null,
      })
    }
  }, [postulante, isOpen])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, fecha: date }))
  }

  const handleDateNacimientoChange = (date) => {
    setFormData((prev) => ({ ...prev, fechaNacimiento: date }))
  }

  const [openFechaNacimiento, setOpenFechaNacimiento] = useState(false)
  const [openFecha, setOpenFecha] = useState(false)
  const btnFechaNacimientoRef = useRef(null)
  const btnFechaRef = useRef(null)
  const [inputFechaNacimiento, setInputFechaNacimiento] = useState('')
  const [inputFechaRegistro, setInputFechaRegistro] = useState('')
  const [previewFechaNacimiento, setPreviewFechaNacimiento] = useState(null)
  const [previewFechaRegistro, setPreviewFechaRegistro] = useState(null)

  useEffect(() => {
    setInputFechaNacimiento(formData.fechaNacimiento ? dayjs(formData.fechaNacimiento).format('DD-MM-YYYY') : '')
    setInputFechaRegistro(formData.fecha ? dayjs(formData.fecha).format('DD-MM-YYYY') : '')
  }, [formData.fechaNacimiento, formData.fecha])

  const handleInputFechaNacimientoBlur = () => {
    if (!inputFechaNacimiento) {
      handleDateNacimientoChange(null)
      return
    }
    const parsed = dayjs(inputFechaNacimiento, 'DD-MM-YYYY', true)
    if (parsed.isValid()) {
      handleDateNacimientoChange(parsed.toDate())
    }
  }

  const handleInputFechaNacimientoChange = (val) => {
    setInputFechaNacimiento(val)
    const p = parsePartialDate(val)
    setPreviewFechaNacimiento(p)
  }

  const handleInputFechaRegistroBlur = () => {
    if (!inputFechaRegistro) {
      handleDateChange(null)
      return
    }
    const parsed = dayjs(inputFechaRegistro, 'DD-MM-YYYY', true)
    if (parsed.isValid()) {
      handleDateChange(parsed.toDate())
    }
  }

  const handleInputFechaRegistroChange = (val) => {
    setInputFechaRegistro(val)
    const p = parsePartialDate(val)
    setPreviewFechaRegistro(p)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const dataToSave = {
      ...formData,
      id: postulante?.id,
      fecha: formData.fecha ? formData.fecha.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      fechaNacimiento: formData.fechaNacimiento ? formData.fechaNacimiento.toISOString().split('T')[0] : null,
    }
    onSave(dataToSave)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={postulante ? 'Editar Postulante' : 'Nuevo Postulante'}
      size="md"
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          label="Nombre Completo"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Ej: Juan Pérez"
          icon={User}
          iconPosition="left"
          required
        />

        <div className={styles.formRow}>
          <Input
            label="DNI"
            id="dni"
            name="dni"
            value={formData.dni}
            onChange={handleChange}
            placeholder="Ej: 12345678"
            icon={CreditCard}
            iconPosition="left"
            maxLength={8}
          />

          <Input
            label="Teléfono"
            id="telefono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            placeholder="Ej: +51 987 654 321"
            icon={Phone}
            iconPosition="left"
          />
        </div>

        <Input
          label="Dirección"
          id="direccion"
          name="direccion"
          value={formData.direccion}
          onChange={handleChange}
          placeholder="Ej: Av. Principal 123, Lima"
          icon={MapPin}
          iconPosition="left"
        />

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="fechaNacimiento" className={styles.label}>
              Fecha de Nacimiento
            </label>
            <Input
              id="fechaNacimiento"
              placeholder="DD-MM-YYYY"
              value={inputFechaNacimiento}
              onChange={(e) => setInputFechaNacimiento(e.target.value)}
              onBlur={handleInputFechaNacimientoBlur}
              onFocus={() => setOpenFechaNacimiento(true)}
              ref={btnFechaNacimientoRef}
              icon={Cake}
              style={{ backgroundColor: '#fbfdff', color: '#0f172a', borderColor: '#eef2ff' }}
            />
            <PopoverCalendar
              open={openFechaNacimiento}
              anchorEl={btnFechaNacimientoRef.current}
              initialValue={formData.fechaNacimiento ? dayjs(formData.fechaNacimiento) : null}
              onClose={() => setOpenFechaNacimiento(false)}
              onSelect={(d) => {
                const date = d ? d.toDate() : null
                handleDateNacimientoChange(date)
                setInputFechaNacimiento(d ? d.format('DD-MM-YYYY') : '')
              }}
              title="Fecha de Nacimiento"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="fecha" className={styles.label}>
              Fecha de Registro *
            </label>
            <Input
              id="fechaRegistro"
              placeholder="DD-MM-YYYY"
              value={inputFechaRegistro}
              onChange={(e) => setInputFechaRegistro(e.target.value)}
              onBlur={handleInputFechaRegistroBlur}
              onFocus={() => setOpenFecha(true)}
              ref={btnFechaRef}
              icon={Calendar}
              style={{ backgroundColor: '#fbfdff', color: '#0f172a', borderColor: '#eef2ff' }}
            />
            <PopoverCalendar
              open={openFecha}
              anchorEl={btnFechaRef.current}
              initialValue={formData.fecha ? dayjs(formData.fecha) : null}
              onClose={() => setOpenFecha(false)}
              onSelect={(d) => {
                const date = d ? d.toDate() : null
                handleDateChange(date)
                setInputFechaRegistro(d ? d.format('DD-MM-YYYY') : '')
              }}
              title="Fecha de Registro"
            />
          </div>
        </div>

        <Input
          label="Correo Electrónico"
          type="email"
          id="correo"
          name="correo"
          value={formData.correo}
          onChange={handleChange}
          placeholder="Ej: juan.perez@senati.pe"
          icon={Mail}
          iconPosition="left"
          required
        />

        <div className={styles.formRow}>
          <Select
            label="Etapa"
            id="etapa"
            name="etapa"
            value={formData.etapa}
            onChange={handleChange}
            options={etapasOptions}
            placeholder="Seleccionar etapa"
            required
          />

          <Select
            label="Estado"
            id="estado"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            options={estadosOptions}
            placeholder="Seleccionar estado"
            required
          />
        </div>

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
            {postulante ? 'Guardar Cambios' : 'Crear Postulante'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

