import { useState, useEffect } from 'react'
import { FileText } from 'lucide-react'
import { Button } from '@shared/components/Button'
import { useToast } from '@shared/components/Toast'
import { useConfiguracion } from '../../hooks/useConfiguracion'
import styles from './Compromiso.module.css'

export default function Compromiso() {
  const toast = useToast()
  const { getSection, updateSection, loading } = useConfiguracion()
  const [plantillas, setPlantillas] = useState([])

  // Cargar plantillas al montar
  useEffect(() => {
    if (!loading) {
      const savedCompromisos = getSection('compromisos')
      if (savedCompromisos && Array.isArray(savedCompromisos)) {
        setPlantillas(savedCompromisos)
      }
    }
  }, [loading, getSection])

  const handleToggleActivo = (id) => {
    const updated = plantillas.map((plantilla) =>
      plantilla.id === id
        ? { ...plantilla, activa: !plantilla.activa }
        : plantilla
    )
    setPlantillas(updated)
    updateSection('compromisos', updated)
    const plantilla = updated.find((p) => p.id === id)
    toast.success(
      plantilla.activa
        ? 'Plantilla activada'
        : 'Plantilla desactivada'
    )
  }

  const handleCambiarPDF = (id) => {
    // Aquí iría la lógica para cambiar el PDF
    console.log('Cambiar PDF para plantilla:', id)
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Plantillas de Compromisos Internos</h2>
        <p className={styles.subtitle}>
          Gestiona los documentos que los estudiantes deben firmar antes de iniciar las prácticas
        </p>
      </div>

      <div className={styles.plantillasList}>
        {plantillas.map((plantilla) => (
          <div key={plantilla.id} className={styles.plantillaCard}>
            <div className={styles.plantillaContent}>
              <div className={styles.plantillaIcon}>
                <FileText size={24} />
              </div>
              <div className={styles.plantillaInfo}>
                <h3 className={styles.plantillaNombre}>{plantilla.nombre}</h3>
                <p className={styles.plantillaEstado}>
                  {plantilla.configurada
                    ? 'Plantilla PDF configurada'
                    : 'Plantilla no configurada'}
                </p>
              </div>
            </div>
            <div className={styles.plantillaActions}>
              <Button
                variant="secondary"
                onClick={() => handleCambiarPDF(plantilla.id)}
                className={styles.cambiarButton}
              >
                Cambiar PDF
              </Button>
              <div className={styles.toggleContainer}>
                <label className={styles.toggleLabel}>
                  <input
                    type="checkbox"
                    checked={plantilla.activa}
                    onChange={() => handleToggleActivo(plantilla.id)}
                    className={styles.toggleInput}
                  />
                  <span
                    className={`${styles.toggleSlider} ${
                      plantilla.activa ? styles.toggleActive : ''
                    }`}
                  />
                  <span className={styles.toggleText}>Activo</span>
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

