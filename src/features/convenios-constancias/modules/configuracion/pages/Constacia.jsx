import { useState } from 'react'
import { FileText, Upload, Save } from 'lucide-react'
import { Input } from '@shared/components/Input'
import { Button } from '@shared/components/Button'
import { useToast } from '@shared/components/Toast'
import styles from './Constacia.module.css'

const camposDinamicos = [
  {
    id: 1,
    campo: 'NOMBRE_COMPLETO',
    descripcion: 'Nombre Completo',
    fuente: 'Perfil del estudiante',
  },
  {
    id: 2,
    campo: 'DNI',
    descripcion: 'DNI',
    fuente: 'Perfil del estudiante',
  },
  {
    id: 3,
    campo: 'HORAS_ACUMULADAS',
    descripcion: 'Horas Acumuladas',
    fuente: 'Módulo de asistencia',
  },
  {
    id: 4,
    campo: 'TAREAS_REALIZADAS',
    descripcion: 'Tareas Realizadas',
    fuente: 'Módulo Tasks',
  },
  {
    id: 5,
    campo: 'EVALUACION_FINAL',
    descripcion: 'Evaluación Final',
    fuente: 'Módulo de evaluaciones',
  },
  {
    id: 6,
    campo: 'ROLES_ASUMIDOS',
    descripcion: 'Roles Asumidos',
    fuente: 'Perfil del estudiante',
  },
]

export default function Constacia() {
  const toast = useToast()
  const [plantillaPath, setPlantillaPath] = useState('/templates/constancia-base.pdf')

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      // Aquí iría la lógica para subir el archivo
      setPlantillaPath(file.name)
      toast.success('Plantilla cargada correctamente')
    }
  }

  const handleSave = () => {
    // Aquí iría la lógica para guardar la configuración
    toast.success('Configuración guardada correctamente')
  }

  return (
    <div className={styles.container}>
      {/* Sección de configuración de plantilla */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Plantilla de constancia prácticas</h2>
          <p className={styles.sectionDescription}>
            Configura la plantilla y los campos dinámicos que se llenarán automáticamente
          </p>
        </div>

        <div className={styles.plantillaConfig}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Plantilla PDF base</label>
            <div className={styles.inputWithButton}>
              <Input
                value={plantillaPath}
                onChange={(e) => setPlantillaPath(e.target.value)}
                placeholder="/templates/constancia-base.pdf"
                className={styles.pathInput}
              />
              <label className={styles.uploadButton}>
                <Upload size={18} />
                Subir Nueva
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className={styles.fileInput}
                />
              </label>
            </div>
            <p className={styles.helpText}>
              La plantilla debe incluir marcadores para los campos dinámicos
            </p>
          </div>
        </div>
      </div>

      {/* Sección de campos dinámicos */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.titleWithIcon}>
            <FileText size={20} />
            <h2 className={styles.sectionTitle}>Campos Dinámicos</h2>
          </div>
          <p className={styles.sectionDescription}>
            Configura qué datos del sistema se insertarán en la constancia
          </p>
        </div>

        <div className={styles.camposGrid}>
          {camposDinamicos.map((campo) => (
            <div key={campo.id} className={styles.campoCard}>
              <div className={styles.campoHeader}>
                <span className={styles.campoNombre}>{`{${campo.campo}}`}</span>
              </div>
              <div className={styles.campoContent}>
                <p className={styles.campoDescripcion}>{campo.descripcion}</p>
                <p className={styles.campoFuente}>{campo.fuente}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Botón de guardar */}
      <div className={styles.saveSection}>
        <Button
          variant="success"
          icon={Save}
          onClick={handleSave}
          size="lg"
          className={styles.saveButton}
        >
          Guardar Configuración
        </Button>
      </div>
    </div>
  )
}

