import { useState } from 'react'
import { Plus, AlertCircle, CheckCircle2, XCircle } from 'lucide-react'
import styles from './AddScheduleDialog.module.css'

export function AddScheduleDialog() {
  const [open, setOpen] = useState(false)
  const [practitioner, setPractitioner] = useState('')
  const [practitionerName, setPractitionerName] = useState('')
  const [institution, setInstitution] = useState('')
  const [scheduleImage, setScheduleImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [scheduleBlocks, setScheduleBlocks] = useState([])
  const [validationStatus, setValidationStatus] = useState('none')
  const [validationMessage, setValidationMessage] = useState('')

  const addScheduleBlock = () => {
    setScheduleBlocks([...scheduleBlocks, { day: '', startTime: '', endTime: '', isRemote: false }])
  }

  const updateScheduleBlock = (index, field, value) => {
    const newBlocks = [...scheduleBlocks]
    newBlocks[index] = { ...newBlocks[index], [field]: value }
    setScheduleBlocks(newBlocks)
  }

  const removeScheduleBlock = (index) => {
    setScheduleBlocks(scheduleBlocks.filter((_, i) => i !== index))
  }

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setScheduleImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const validateSchedule = () => {
    setValidationStatus('validating')

    setTimeout(() => {
      const nameMatch = practitionerName.toLowerCase().includes('juan')
      const hasBlocks = scheduleBlocks.length > 0
      const allBlocksComplete = scheduleBlocks.every((b) => b.day && b.startTime && b.endTime)

      if (!nameMatch) {
        setValidationStatus('pending')
        setValidationMessage('El nombre en la captura no coincide con el registrado. Pendiente de verificación manual.')
      } else if (!hasBlocks || !allBlocksComplete) {
        setValidationStatus('rejected')
        setValidationMessage('Debes declarar al menos un bloque de horario completo.')
      } else {
        setValidationStatus('approved')
        setValidationMessage('Horario validado correctamente. Los bloques serán excluidos del cálculo de asistencia.')
      }
    }, 2000)
  }

  const handleSave = () => {
    console.log('Guardando horario:', {
      practitioner,
      practitionerName,
      institution,
      scheduleImage: scheduleImage?.name,
      scheduleBlocks,
      validationStatus
    })
    setOpen(false)
    // Reset form
    setPractitioner('')
    setPractitionerName('')
    setInstitution('')
    setScheduleImage(null)
    setImagePreview(null)
    setScheduleBlocks([])
    setValidationStatus('none')
  }

  if (!open) {
    return (
      <button className={`${styles.button} ${styles.buttonPrimary}`} onClick={() => setOpen(true)}>
        <Plus size={16} />
        Registrar Horario
      </button>
    )
  }

  return (
    <div className={styles.dialogOverlay} onClick={() => setOpen(false)}>
      <div className={styles.dialogContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.dialogHeader}>
          <h2 className={styles.dialogTitle}>Registrar Horario de Clases con Evidencia</h2>
          <p className={styles.dialogDescription}>
            Sube una captura de tu horario oficial y declara los bloques de clase que se cruzan con el horario de
            prácticas (8:00-14:00)
          </p>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>1. Información del Practicante</h3>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="practitioner">
              Practicante
            </label>
            <select
              id="practitioner"
              className={styles.select}
              value={practitioner}
              onChange={(e) => setPractitioner(e.target.value)}
            >
              <option value="">Seleccionar practicante</option>
              <option value="juan">Juan Pérez - Rpsoft</option>
              <option value="maria">María García - Innovacion</option>
              <option value="carlos">Carlos López - Laboratorios</option>
            </select>
          </div>

          <div className={styles.gridTwo}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="name">
                Nombre completo (según horario)
              </label>
              <input
                id="name"
                type="text"
                className={styles.input}
                placeholder="Juan Pérez Gómez"
                value={practitionerName}
                onChange={(e) => setPractitionerName(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="institution">
                Institución
              </label>
              <input
                id="institution"
                type="text"
                className={styles.input}
                placeholder="SENATI, UNI, etc."
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>2. Evidencia del Horario Oficial</h3>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="schedule-image">
              Captura de pantalla del horario
            </label>
            <div className={styles.fileInputWrapper}>
              <input
                id="schedule-image"
                type="file"
                className={styles.input}
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleImageUpload}
              />
              {scheduleImage && <CheckCircle2 className={styles.successIcon} size={20} />}
            </div>
            <p className={styles.helpText}>Sube una captura clara de tu horario oficial (PNG o JPG)</p>
          </div>

          {imagePreview && (
            <div className={styles.imagePreview}>
              <img src={imagePreview} alt="Preview" />
            </div>
          )}
        </div>

        <div className={styles.section}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 className={styles.sectionTitle} style={{ margin: 0 }}>
              3. Declarar Bloques de Clase
            </h3>
            <button
              className={`${styles.button} ${styles.buttonOutline} ${styles.buttonSmall}`}
              onClick={addScheduleBlock}
              disabled={!scheduleImage}
            >
              <Plus size={14} />
              Agregar Bloque
            </button>
          </div>

          {scheduleBlocks.length === 0 && (
            <div className={`${styles.alert} ${styles.alertInfo}`}>
              <AlertCircle className={styles.alertIcon} size={16} />
              <div className={styles.alertContent}>
                Agrega los bloques de horario que se cruzan con el horario de prácticas (8:00-14:00)
              </div>
            </div>
          )}

          {scheduleBlocks.map((block, index) => (
            <div key={index} className={styles.blockCard}>
              <div className={styles.blockHeader}>
                <span className={styles.blockTitle}>Bloque {index + 1}</span>
                <button className={styles.iconButton} onClick={() => removeScheduleBlock(index)}>
                  <XCircle size={16} />
                </button>
              </div>

              <div className={styles.gridThree}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Día</label>
                  <select
                    className={styles.select}
                    value={block.day}
                    onChange={(e) => updateScheduleBlock(index, 'day', e.target.value)}
                  >
                    <option value="">Día</option>
                    <option value="monday">Lunes</option>
                    <option value="tuesday">Martes</option>
                    <option value="wednesday">Miércoles</option>
                    <option value="thursday">Jueves</option>
                    <option value="friday">Viernes</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Inicio</label>
                  <input
                    type="time"
                    className={styles.input}
                    value={block.startTime}
                    onChange={(e) => updateScheduleBlock(index, 'startTime', e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Fin</label>
                  <input
                    type="time"
                    className={styles.input}
                    value={block.endTime}
                    onChange={(e) => updateScheduleBlock(index, 'endTime', e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  id={`remote-${index}`}
                  className={styles.checkbox}
                  checked={block.isRemote}
                  onChange={(e) => updateScheduleBlock(index, 'isRemote', e.target.checked)}
                />
                <label htmlFor={`remote-${index}`} className={styles.checkboxLabel}>
                  Clase remota/virtual
                </label>
              </div>
            </div>
          ))}
        </div>

        {scheduleImage && scheduleBlocks.length > 0 && validationStatus === 'none' && (
          <button className={`${styles.button} ${styles.buttonSuccess}`} onClick={validateSchedule} style={{ width: '100%' }}>
            <CheckCircle2 size={16} />
            Validar Horario
          </button>
        )}

        {validationStatus === 'validating' && (
          <div className={`${styles.alert} ${styles.alertInfo}`}>
            <AlertCircle className={`${styles.alertIcon} ${styles.pulse}`} size={16} />
            <div className={styles.alertContent}>
              Validando coherencia entre la captura y los bloques declarados...
            </div>
          </div>
        )}

        {validationStatus === 'approved' && (
          <div className={`${styles.alert} ${styles.alertSuccess}`}>
            <CheckCircle2 className={styles.alertIcon} size={16} />
            <div className={styles.alertContent}>
              <strong>Horario aprobado:</strong> {validationMessage}
            </div>
          </div>
        )}

        {validationStatus === 'pending' && (
          <div className={`${styles.alert} ${styles.alertWarning}`}>
            <AlertCircle className={styles.alertIcon} size={16} />
            <div className={styles.alertContent}>
              <strong>Pendiente de verificación:</strong> {validationMessage}
            </div>
          </div>
        )}

        {validationStatus === 'rejected' && (
          <div className={`${styles.alert} ${styles.alertError}`}>
            <XCircle className={styles.alertIcon} size={16} />
            <div className={styles.alertContent}>
              <strong>Horario rechazado:</strong> {validationMessage}
            </div>
          </div>
        )}

        <div className={styles.buttonGroup}>
          <button className={`${styles.button} ${styles.buttonOutline}`} onClick={() => setOpen(false)}>
            Cancelar
          </button>
          <button
            className={`${styles.button} ${styles.buttonPrimary}`}
            onClick={handleSave}
            disabled={validationStatus !== 'approved' && validationStatus !== 'pending'}
          >
            Guardar Horario
          </button>
        </div>
      </div>
    </div>
  )
}
