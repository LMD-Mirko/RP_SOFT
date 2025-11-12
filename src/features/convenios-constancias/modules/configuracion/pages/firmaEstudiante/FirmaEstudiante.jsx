import { useState, useEffect } from 'react'
import { Save } from 'lucide-react'
import { Input } from '@shared/components/Input'
import { Button } from '@shared/components/Button'
import { useToast } from '@shared/components/Toast'
import { useConfiguracion } from '../../hooks/useConfiguracion'
import styles from './FirmaEstudiante.module.css'

export default function FirmaEstudiante() {
  const toast = useToast()
  const { getSection, updateSection, loading } = useConfiguracion()
  const [configuracion, setConfiguracion] = useState({
    permitirDibujarFirma: true,
    permitirSubirImagen: true,
    validezTokenDias: 10,
  })

  // Cargar configuración al montar
  useEffect(() => {
    if (!loading) {
      const savedConfig = getSection('firmaEstudiante')
      if (savedConfig) {
        setConfiguracion(savedConfig)
      }
    }
  }, [loading, getSection])

  const handleToggleDibujar = () => {
    const newValue = !configuracion.permitirDibujarFirma
    const updated = {
      ...configuracion,
      permitirDibujarFirma: newValue,
    }
    setConfiguracion(updated)
    updateSection('firmaEstudiante', updated)
    toast.success(
      newValue
        ? 'Dibujo de firma habilitado'
        : 'Dibujo de firma deshabilitado'
    )
  }

  const handleToggleSubirImagen = () => {
    const newValue = !configuracion.permitirSubirImagen
    const updated = {
      ...configuracion,
      permitirSubirImagen: newValue,
    }
    setConfiguracion(updated)
    updateSection('firmaEstudiante', updated)
    toast.success(
      newValue
        ? 'Subida de imagen habilitada'
        : 'Subida de imagen deshabilitada'
    )
  }

  const handleValidezChange = (e) => {
    const value = parseInt(e.target.value) || 1
    if (value < 1) {
      toast.error('El valor mínimo es 1 día')
      return
    }
    const updated = {
      ...configuracion,
      validezTokenDias: value,
    }
    setConfiguracion(updated)
    // Guardar automáticamente al cambiar
    updateSection('firmaEstudiante', updated)
  }

  const handleGuardar = () => {
    updateSection('firmaEstudiante', configuracion)
    toast.success('Configuración guardada correctamente')
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div>
            <h2 className={styles.cardTitle}>Configuracion de Firma Electronica</h2>
            <p className={styles.cardSubtitle}>
              Opciones para la firma de estudiantes en el portal
            </p>
          </div>
        </div>

        <div className={styles.configSection}>
          {/* Opción 1: Permitir dibujar firma */}
          <div className={styles.optionCard}>
            <div className={styles.optionContent}>
              <div className={styles.optionInfo}>
                <h3 className={styles.optionTitle}>Permitir dibujar firma</h3>
                <p className={styles.optionDescription}>
                  Los estudiantes pueden dibujar su firma con el mouse
                </p>
              </div>
              <div className={styles.toggleContainer}>
                <label className={styles.toggleLabel}>
                  <input
                    type="checkbox"
                    checked={configuracion.permitirDibujarFirma}
                    onChange={handleToggleDibujar}
                    className={styles.toggleInput}
                  />
                  <span
                    className={`${styles.toggleSlider} ${
                      configuracion.permitirDibujarFirma ? styles.toggleActive : ''
                    }`}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Opción 2: Permitir subir imagen de firma */}
          <div className={styles.optionCard}>
            <div className={styles.optionContent}>
              <div className={styles.optionInfo}>
                <h3 className={styles.optionTitle}>Permitir subir imagen de firma</h3>
                <p className={styles.optionDescription}>
                  Los estudiantes pueden subir una imagen de su firma
                </p>
              </div>
              <div className={styles.toggleContainer}>
                <label className={styles.toggleLabel}>
                  <input
                    type="checkbox"
                    checked={configuracion.permitirSubirImagen}
                    onChange={handleToggleSubirImagen}
                    className={styles.toggleInput}
                  />
                  <span
                    className={`${styles.toggleSlider} ${
                      configuracion.permitirSubirImagen ? styles.toggleActive : ''
                    }`}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Validez del token */}
        <div className={styles.validezSection}>
          <div className={styles.validezContent}>
            <label className={styles.validezLabel}>
              Validez del token de firma (días)
            </label>
            <div className={styles.inputContainer}>
              <input
                type="number"
                value={configuracion.validezTokenDias}
                onChange={handleValidezChange}
                min="1"
                className={styles.numberInput}
              />
              <Button
                variant="primary"
                icon={Save}
                onClick={handleGuardar}
                className={styles.saveButton}
              >
                Guardar Configuracion
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

