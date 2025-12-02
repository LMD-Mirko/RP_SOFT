import { useState, useEffect } from 'react'
import { Input } from '@shared/components/Input'
import { Button } from '@shared/components/Button'
import { CascadeSelect } from '@shared/components/CascadeSelect'
import { DocumentTypeSelect } from '@shared/components/DocumentTypeSelect'
import { Select as AntSelect } from 'antd'
import { User, Mail, Phone, CreditCard, Calendar, MapPin, Home, BookOpen, Clock, CheckCircle2 } from 'lucide-react'
import { getSpecialties } from '../../../shared/services'
import styles from './DatosPersonalesStep.module.css'

// Estilos inline para quitar flechas de inputs numéricos
const numericInputStyle = {
  MozAppearance: 'textfield',
  WebkitAppearance: 'none',
  appearance: 'none'
}

export function DatosPersonalesStep({ data, onNext, isFirstStep, userFields = {}, personalData = null }) {
  const [formData, setFormData] = useState({
    nombres: data.nombres || '',
    apellidos: data.apellidos || '',
    telefono: data.telefono || '',
    tipoDocumento: data.tipoDocumento || '',
    dni: data.dni || '',
    fechaNacimiento: data.fechaNacimiento || '',
    distrito: data.distrito || '',
    direccion: data.direccion || '',
    sexo: data.sexo || 'M',
    especialidadId: data.especialidadId || '',
    carrera: data.carrera || '',
    semestre: data.semestre || '',
    nivelExperiencia: data.nivelExperiencia || 'principiante',
    selectedData: data.selectedData || null, // Para guardar datos de ubicación
  })

  const [errors, setErrors] = useState({})
  const [specialties, setSpecialties] = useState([])
  const [loadingSpecialties, setLoadingSpecialties] = useState(true)

  // Actualizar formData cuando cambien los datos del User (vienen del GET)
  useEffect(() => {
    if (data || personalData) {
      setFormData(prev => {
        // Obtener valores desde data o personalData para campos del User
        const nombresValue = data?.nombres || (userFields.name && personalData?.name) || prev.nombres || ''
        const apellidosValue = data?.apellidos || (userFields.paternal_lastname && [
          personalData?.paternal_lastname,
          personalData?.maternal_lastname
        ].filter(Boolean).join(' ')) || prev.apellidos || ''
        const dniValue = data?.dni || (userFields.document_number && personalData?.document_number) || prev.dni || ''
        const telefonoValue = data?.telefono || (userFields.phone && personalData?.phone?.replace(/^\+51/, '')) || prev.telefono || ''
        
        // Para ubicación: si viene del User, solo guardar el nombre (no selectedData)
        const districtName = typeof personalData?.district === 'object' 
          ? personalData.district?.name 
          : personalData?.district
        const distritoValue = data?.distrito || (userFields.district_id && districtName) || prev.distrito || ''
        
        return {
          ...prev,
          nombres: nombresValue,
          apellidos: apellidosValue,
          telefono: telefonoValue,
          dni: dniValue,
          // Si la ubicación viene del User, NO pre-llenar el CascadeSelect
          // Solo guardar el nombre para mostrarlo en el input de solo lectura
          distrito: distritoValue,
          selectedData: userFields.district_id ? null : (data?.selectedData || prev.selectedData || null),
          // Campos específicos del postulante también se actualizan
          fechaNacimiento: data?.fechaNacimiento || prev.fechaNacimiento || '',
          direccion: data?.direccion || prev.direccion || '',
          especialidadId: data?.especialidadId || prev.especialidadId || '',
          carrera: data?.carrera || prev.carrera || '',
          semestre: data?.semestre || prev.semestre || '',
          nivelExperiencia: data?.nivelExperiencia || prev.nivelExperiencia || 'principiante',
        }
      })
      
      // Limpiar errores de campos del User que ya están completados
      setErrors(prev => {
        const newErrors = { ...prev }
        if (userFields.name && newErrors.nombres) delete newErrors.nombres
        if (userFields.paternal_lastname && newErrors.apellidos) delete newErrors.apellidos
        if (userFields.document_number && newErrors.dni) delete newErrors.dni
        if (userFields.phone && newErrors.telefono) delete newErrors.telefono
        if (userFields.district_id && newErrors.distrito) delete newErrors.distrito
        return newErrors
      })
    }
  }, [data, userFields, personalData])

  // Cargar especialidades
  useEffect(() => {
    const loadSpecialties = async () => {
      try {
        setLoadingSpecialties(true);
        const response = await getSpecialties({ include_inactive: false });
        const formatted = (response.results || response || []).map(spec => ({
          value: spec.id,
          label: spec.name,
          description: spec.description,
        }));
        setSpecialties(formatted);
      } catch (error) {
        console.error('Error al cargar especialidades:', error);
        setSpecialties([]);
        // No mostrar error al usuario, solo dejar el select vacío
      } finally {
        setLoadingSpecialties(false);
      }
    };
    loadSpecialties();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target
    
    // No permitir cambios en campos del User si están deshabilitados
    if (name === 'nombres' && userFields.name) return
    if (name === 'apellidos' && userFields.paternal_lastname) return
    if (name === 'dni' && userFields.document_number) return
    if (name === 'telefono' && userFields.phone) return
    if (name === 'distrito' && userFields.district_id) return
    
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

  // Manejar cambio de Select de Ant Design (devuelve el valor directamente)
  const handleSelectChange = (name) => (value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  // Manejar cambio del CascadeSelect (ubicación)
  const handleLocationChange = (e) => {
    const { value, selectedData } = e.target;
    setFormData(prev => ({
      ...prev,
      distrito: value,
      selectedData: selectedData,
    }));
    if (errors.distrito) {
      setErrors(prev => ({ ...prev, distrito: '' }));
    }
  }


  const validate = () => {
    const newErrors = {}
    
    // Validar campos del User solo si NO vienen del User (no están completados)
    if (!userFields.name && !formData.nombres.trim()) {
      newErrors.nombres = 'Requerido'
    }
    if (!userFields.paternal_lastname && !formData.apellidos.trim()) {
      newErrors.apellidos = 'Requerido'
    }
    if (!userFields.phone) {
      if (!formData.telefono.trim()) {
        newErrors.telefono = 'Requerido'
      } else if (formData.telefono.length !== 9) {
        newErrors.telefono = 'Teléfono debe tener 9 dígitos'
      }
    }
    if (!userFields.document_number) {
      if (!formData.dni.trim()) {
        newErrors.dni = 'Requerido'
      } else if (formData.dni.length !== 8) {
        newErrors.dni = 'DNI debe tener 8 dígitos'
      }
    }
    
    // Tipo de documento siempre se valida (no viene del User)
    if (!formData.tipoDocumento) {
      newErrors.tipoDocumento = 'Requerido'
    }
    
    // Validar ubicación: si NO viene del User, debe estar seleccionada
    if (!userFields.district_id && (!formData.distrito || !formData.selectedData)) {
      newErrors.distrito = 'Requerido'
    }
    
    // Campos específicos del postulante (siempre se validan)
    if (!formData.fechaNacimiento) {
      newErrors.fechaNacimiento = 'Requerido'
    }
    if (!formData.direccion.trim()) {
      newErrors.direccion = 'Requerido'
    }
    if (!formData.especialidadId) {
      newErrors.especialidadId = 'Requerido'
    }
    if (!formData.carrera.trim()) {
      newErrors.carrera = 'Requerido'
    }
    if (!formData.semestre.trim()) {
      newErrors.semestre = 'Requerido'
    }
    if (!formData.nivelExperiencia) {
      newErrors.nivelExperiencia = 'Requerido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      // Asegurar que los valores de los campos del User se incluyan, incluso si están deshabilitados
      const dataToSend = {
        ...formData,
        // Si los campos vienen del User, asegurar que tengan valores desde personalData
        nombres: userFields.name && !formData.nombres ? (personalData?.name || formData.nombres) : formData.nombres,
        apellidos: userFields.paternal_lastname && !formData.apellidos 
          ? ([personalData?.paternal_lastname, personalData?.maternal_lastname].filter(Boolean).join(' ') || formData.apellidos)
          : formData.apellidos,
        dni: userFields.document_number && !formData.dni ? (personalData?.document_number || formData.dni) : formData.dni,
        telefono: userFields.phone && !formData.telefono 
          ? (personalData?.phone?.replace(/^\+51/, '') || formData.telefono)
          : formData.telefono,
        distrito: userFields.district_id && !formData.distrito
          ? (personalData?.district?.name || (typeof personalData?.district === 'string' ? personalData.district : '') || formData.distrito)
          : formData.distrito,
        // Si la ubicación viene del User, asegurar que selectedData tenga los datos correctos para el POST
        selectedData: userFields.district_id && !formData.selectedData && personalData?.district_id
          ? {
              distrito: {
                id: personalData.district_id,
                name: personalData?.district?.name || (typeof personalData?.district === 'string' ? personalData.district : '')
              },
              provincia: {
                id: personalData.province_id || '',
                name: personalData.province || ''
              },
              region: {
                id: personalData.region_id || '',
                name: personalData.region || ''
              }
            }
          : formData.selectedData
      }
      onNext(dataToSend)
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
            <div className={styles.formGroup}>
              <label htmlFor="nombres" className={styles.label}>
                Nombres <span className={styles.required}>*</span>
                {userFields.name && (
                  <span className={styles.completedBadge}>
                    <CheckCircle2 size={14} /> Ya completado
                  </span>
                )}
              </label>
              <Input
                id="nombres"
                name="nombres"
                value={formData.nombres}
                onChange={handleChange}
                placeholder="Ingrese sus nombres"
                icon={User}
                iconPosition="left"
                error={errors.nombres}
                disabled={userFields.name}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="apellidos" className={styles.label}>
                Apellidos <span className={styles.required}>*</span>
                {userFields.paternal_lastname && (
                  <span className={styles.completedBadge}>
                    <CheckCircle2 size={14} /> Ya completado
                  </span>
                )}
              </label>
              <Input
                id="apellidos"
                name="apellidos"
                type="text"
                value={formData.apellidos}
                onChange={handleChange}
                placeholder="Ingrese sus apellidos"
                icon={User}
                iconPosition="left"
                error={errors.apellidos}
                disabled={userFields.paternal_lastname}
                required
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="telefono" className={styles.label}>
                Teléfono <span className={styles.required}>*</span>
                {userFields.phone && (
                  <span className={styles.completedBadge}>
                    <CheckCircle2 size={14} /> Ya completado
                  </span>
                )}
              </label>
              <Input
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
                disabled={userFields.phone}
                required
              />
            </div>

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
            <div className={styles.formGroup}>
              <label htmlFor="dni" className={styles.label}>
                Número de Documento <span className={styles.required}>*</span>
                {userFields.document_number && (
                  <span className={styles.completedBadge}>
                    <CheckCircle2 size={14} /> Ya completado
                  </span>
                )}
              </label>
              <Input
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
                disabled={userFields.document_number}
                required
              />
            </div>

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
            <div className={styles.formGroup}>
              <label htmlFor="distrito" className={styles.label}>
                Ubicación <span className={styles.required}>*</span>
                {userFields.district_id && (
                  <span className={styles.completedBadge}>
                    <CheckCircle2 size={14} /> Ya completado
                  </span>
                )}
              </label>
              {userFields.district_id ? (
                // Si ya viene del User, mostrar solo el nombre del distrito en un input de solo lectura
                <Input
                  id="distrito"
                  name="distrito"
                  value={
                    formData.distrito || 
                    personalData?.district?.name || 
                    (typeof personalData?.district === 'string' ? personalData.district : '') ||
                    ''
                  }
                  placeholder="Ubicación ya completada"
                  icon={MapPin}
                  iconPosition="left"
                  disabled={true}
                  readOnly
                />
              ) : (
                // Si NO viene del User, permitir seleccionar
                <CascadeSelect
                  id="distrito"
                  name="distrito"
                  value={formData.distrito}
                  selectedData={formData.selectedData}
                  onChange={handleLocationChange}
                  placeholder="Seleccione Región > Provincia > Distrito"
                  error={errors.distrito}
                  required
                />
              )}
              {errors.distrito && (
                <span className={styles.errorText}>{errors.distrito}</span>
              )}
            </div>
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

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="sexo" className={styles.label}>
                Sexo <span className={styles.required}>*</span>
              </label>
              <AntSelect
                id="sexo"
                name="sexo"
                value={formData.sexo || undefined}
                onChange={handleSelectChange('sexo')}
                options={[
                  { value: 'M', label: 'Masculino' },
                  { value: 'F', label: 'Femenino' },
                ]}
                placeholder="Seleccione sexo"
                status={errors.sexo ? 'error' : ''}
                className={styles.antSelect}
                style={{ width: '100%' }}
              />
              {errors.sexo && (
                <span className={styles.errorText}>{errors.sexo}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="especialidadId" className={styles.label}>
                Especialidad <span className={styles.required}>*</span>
              </label>
              <AntSelect
                id="especialidadId"
                name="especialidadId"
                value={formData.especialidadId || undefined}
                onChange={handleSelectChange('especialidadId')}
                options={specialties}
                placeholder={
                  loadingSpecialties 
                    ? 'Cargando especialidades...' 
                    : specialties.length === 0 
                    ? 'No hay especialidades disponibles' 
                    : 'Seleccione especialidad'
                }
                disabled={loadingSpecialties || specialties.length === 0}
                status={errors.especialidadId ? 'error' : ''}
                className={styles.antSelect}
                style={{ width: '100%' }}
                showSearch
                notFoundContent={loadingSpecialties ? 'Cargando...' : 'No hay especialidades disponibles'}
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
              />
              {errors.especialidadId && (
                <span className={styles.errorText}>{errors.especialidadId}</span>
              )}
            </div>
          </div>

          <div className={styles.formRow}>
            <Input
              label="Carrera"
              id="carrera"
              name="carrera"
              value={formData.carrera}
              onChange={handleChange}
              placeholder="Ej: Ingeniería de Sistemas"
              icon={BookOpen}
              iconPosition="left"
              error={errors.carrera}
              required
            />

            <Input
              label="Semestre"
              id="semestre"
              name="semestre"
              type="number"
              value={formData.semestre}
              onChange={handleChange}
              placeholder="Ej: 10"
              icon={Clock}
              iconPosition="left"
              error={errors.semestre}
              min="1"
              max="20"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="nivelExperiencia" className={styles.label}>
              Nivel de Experiencia <span className={styles.required}>*</span>
            </label>
            <AntSelect
              id="nivelExperiencia"
              name="nivelExperiencia"
              value={formData.nivelExperiencia || undefined}
              onChange={handleSelectChange('nivelExperiencia')}
              options={[
                { value: 'principiante', label: 'Principiante' },
                { value: 'intermedio', label: 'Intermedio' },
                { value: 'avanzado', label: 'Avanzado' },
              ]}
              placeholder="Seleccione nivel de experiencia"
              status={errors.nivelExperiencia ? 'error' : ''}
              className={styles.antSelect}
              style={{ width: '100%' }}
            />
            {errors.nivelExperiencia && (
              <span className={styles.errorText}>{errors.nivelExperiencia}</span>
            )}
          </div>

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