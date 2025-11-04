import { useState, useEffect } from 'react'
import { User, Mail, FileText, Calendar, CreditCard, Phone, MapPin, Cake } from 'lucide-react'
import { Modal } from '@shared/components/Modal'
import { Input } from '@shared/components/Input'
import { Select } from '@shared/components/Select'
import { DatePicker } from '@shared/components/DatePicker'
import { Button } from '@shared/components/Button'
import styles from './PostulanteModal.module.css'

const etapasOptions = [
  { value: 'Formulario', label: 'Formulario' },
  { value: 'Prueba Técnica', label: 'Prueba Técnica' },
  { value: 'Entrevista', label: 'Entrevista' },
  { value: 'Evaluación', label: 'Evaluación' },
]

const estadosOptions = [
  { value: 'Pendiente', label: 'Pendiente' },
  { value: 'En Progreso', label: 'En Progreso' },
  { value: 'Completado', label: 'Completado' },
]

export function PostulanteModal({ isOpen, onClose, onSave, postulante = null }) {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    dni: '',
    telefono: '',
    direccion: '',
    fechaNacimiento: null,
    etapa: '',
    estado: '',
    fecha: null,
  })

  useEffect(() => {
    if (postulante) {
      setFormData({
        nombre: postulante.nombre || '',
        correo: postulante.correo || '',
        dni: postulante.dni || '',
        telefono: postulante.telefono || '',
        direccion: postulante.direccion || '',
        fechaNacimiento: postulante.fechaNacimiento ? new Date(postulante.fechaNacimiento) : null,
        etapa: postulante.etapa || '',
        estado: postulante.estado || '',
        fecha: postulante.fecha ? new Date(postulante.fecha) : null,
      })
    } else {
      setFormData({
        nombre: '',
        correo: '',
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
            <DatePicker
              selected={formData.fechaNacimiento}
              onChange={handleDateNacimientoChange}
              placeholder="Seleccionar fecha"
              maxDate={new Date()}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="fecha" className={styles.label}>
              Fecha de Registro *
            </label>
            <DatePicker
              selected={formData.fecha}
              onChange={handleDateChange}
              placeholder="Seleccionar fecha"
              maxDate={new Date()}
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

