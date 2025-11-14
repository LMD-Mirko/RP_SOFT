import { useState, useEffect } from 'react'
import { Input } from '@shared/components/Input'
import { Button } from '@shared/components/Button'
import { CascadeSelect } from '@shared/components/CascadeSelect'
import { DocumentTypeSelect } from '@shared/components/DocumentTypeSelect'
import { User, Mail, Phone, CreditCard, Calendar, MapPin, Home } from 'lucide-react'
import styles from './DatosPersonalesStep.module.css'

// Estilos inline para quitar flechas de inputs numéricos
const numericInputStyle = {
  MozAppearance: 'textfield',
  WebkitAppearance: 'none',
  appearance: 'none'
}

export function DatosPersonalesStep({ data, onNext, isFirstStep }) {
  const [formData, setFormData] = useState({
    nombres: data.nombres || '',
    apellidos: data.apellidos || '',
    telefono: data.telefono || '',
    tipoDocumento: data.tipoDocumento || '',
    dni: data.dni || '',
    fechaNacimiento: data.fechaNacimiento || '',
    distrito: data.distrito || '',
    direccion: data.direccion || '',
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    
    // Limitar longitud de teléfono y DNI
    if (name === 'telefono' && value.length > 9) return
    if (name === 'dni' && value.length > 8) return
    
    // No permitir números en nombres y apellidos
    if ((name === 'nombres' || name === 'apellidos') && /\d/.test(value)) return
    
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }


  const validate = () => {
    const newErrors = {}
    
    if (!formData.nombres.trim()) newErrors.nombres = 'Requerido'
    if (!formData.apellidos.trim()) newErrors.apellidos = 'Requerido'
    if (!formData.telefono.trim()) newErrors.telefono = 'Requerido'
    else if (formData.telefono.length !== 9) newErrors.telefono = 'Teléfono debe tener 9 dígitos'
    if (!formData.tipoDocumento) newErrors.tipoDocumento = 'Requerido'
    if (!formData.dni.trim()) newErrors.dni = 'Requerido'
    else if (formData.dni.length !== 8) newErrors.dni = 'DNI debe tener 8 dígitos'
    if (!formData.fechaNacimiento) newErrors.fechaNacimiento = 'Requerido'
    if (!formData.distrito) newErrors.distrito = 'Requerido'
    if (!formData.direccion.trim()) newErrors.direccion = 'Requerido'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      onNext(formData)
    }
  }

  return (
    <div className={styles.stepContainer}>
      <div className={styles.stepCard}>
        <div className={styles.stepHeader}>
          <h2 className={styles.stepTitle}>Datos Personales</h2>
          <p className={styles.stepSubtitle}>Completa tu información para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formRow}>
            <Input
              label="Nombres"
              id="nombres"
              name="nombres"
              value={formData.nombres}
              onChange={handleChange}
              placeholder="Ingrese sus nombres"
              icon={User}
              iconPosition="left"
              error={errors.nombres}
              required
            />

            <Input
              label="Apellidos"
              id="apellidos"
              name="apellidos"
              type="text"
              value={formData.apellidos}
              onChange={handleChange}
              placeholder="Ingrese sus apellidos"
              icon={User}
              iconPosition="left"
              error={errors.apellidos}
              required
            />
          </div>

          <div className={styles.formRow}>
            <Input
              label="Teléfono"
              id="telefono"
              name="telefono"
              type="number"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="999 999 999"
              icon={Phone}
              iconPosition="left"
              error={errors.telefono}
              style={numericInputStyle}
              required
            />

            <DocumentTypeSelect
              label="Tipo de Documento"
              id="tipoDocumento"
              name="tipoDocumento"
              value={formData.tipoDocumento}
              onChange={handleChange}
              placeholder="Seleccione tipo de documento"
              error={errors.tipoDocumento}
              required
            />
          </div>

          <div className={styles.formRow}>
            <Input
              label="Número de Documento"
              id="dni"
              name="dni"
              type="number"
              value={formData.dni}
              onChange={handleChange}
              placeholder="12345678"
              icon={CreditCard}
              iconPosition="left"
              maxLength={8}
              error={errors.dni}
              style={numericInputStyle}
              required
            />

            <div className={styles.formGroup}>
              <label htmlFor="fechaNacimiento" className={styles.label}>
                Fecha de Nacimiento *
              </label>
              <input
                type="date"
                id="fechaNacimiento"
                name="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleChange}
                className={`${styles.input} ${errors.fechaNacimiento ? styles.inputError : ''}`}
                required
              />
              {errors.fechaNacimiento && (
                <span className={styles.errorText}>{errors.fechaNacimiento}</span>
              )}
            </div>
          </div>

          <div className={styles.formRow}>
            <CascadeSelect
              label="Ubicación"
              id="distrito"
              name="distrito"
              value={formData.distrito}
              onChange={handleChange}
              placeholder="Seleccione Región > Provincia > Distrito"
              error={errors.distrito}
              required
            />
          </div>

          <Input
            label="Dirección"
            id="direccion"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            placeholder="Ingrese su dirección"
            icon={Home}
            iconPosition="left"
            error={errors.direccion}
            required
          />

          <div className={styles.actions}>
            <Button
              type="button"
              variant="secondary"
              disabled={isFirstStep}
              className={styles.buttonSecondary}
            >
              Atrás
            </Button>
            <Button
              type="submit"
              variant="primary"
              className={styles.buttonPrimary}
            >
              Siguiente
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}