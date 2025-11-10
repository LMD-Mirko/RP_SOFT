import { useState } from 'react'
import { FileText } from 'lucide-react'
import { Button } from '@shared/components/Button'
import styles from './Compromiso.module.css'

const plantillasIniciales = [
  {
    id: 1,
    nombre: 'Acuerdo de Confidencialidad',
    configurada: true,
    activa: true,
  },
  {
    id: 2,
    nombre: 'Sesión de Derechos de Autor',
    configurada: true,
    activa: true,
  },
  {
    id: 3,
    nombre: 'Aceptación del Reglamento Interno',
    configurada: true,
    activa: true,
  },
  {
    id: 4,
    nombre: 'Términos y Condiciones',
    configurada: true,
    activa: true,
  },
]

export default function Compromiso() {
  const [plantillas, setPlantillas] = useState(plantillasIniciales)

  const handleToggleActivo = (id) => {
    setPlantillas((prev) =>
      prev.map((plantilla) =>
        plantilla.id === id
          ? { ...plantilla, activa: !plantilla.activa }
          : plantilla
      )
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

