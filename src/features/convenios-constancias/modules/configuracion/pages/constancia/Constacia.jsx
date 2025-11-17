import { useState, useEffect } from 'react'
import { FileText, Upload, Save } from 'lucide-react'
import { Input } from '@shared/components/Input'
import { Button } from '@shared/components/Button'
import { useToast } from '@shared/components/Toast'
import { useConfiguracion } from '../../hooks/useConfiguracion'
import styles from './Constacia.module.css'

export default function Constacia() {
  const toast = useToast()
  const { getSection, updateSection, loading } = useConfiguracion()
  const [plantillaPath, setPlantillaPath] = useState('/templates/constancia-base.pdf')
  const [camposDinamicos, setCamposDinamicos] = useState([])

  // Cargar configuración al montar
  useEffect(() => {
    if (!loading) {
      const savedConstancia = getSection('constancia')
      if (savedConstancia) {
        if (savedConstancia.plantillaPath) {
          setPlantillaPath(savedConstancia.plantillaPath)
        }
        if (savedConstancia.camposDinamicos) {
          setCamposDinamicos(savedConstancia.camposDinamicos)
        }
      }
    }
  }, [loading, getSection])

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const fileName = file.name
      setPlantillaPath(fileName)
      const savedConstancia = getSection('constancia') || {}
      const updated = {
        ...savedConstancia,
        plantillaPath: fileName,
      }
      updateSection('constancia', updated)
      toast.success('Plantilla cargada correctamente')
    }
  }

  const handlePathChange = (e) => {
    const value = e.target.value
    setPlantillaPath(value)
    const savedConstancia = getSection('constancia') || {}
    const updated = {
      ...savedConstancia,
      plantillaPath: value,
    }
    updateSection('constancia', updated)
  }

  const handleSave = () => {
    const savedConstancia = getSection('constancia') || {}
    const updated = {
      ...savedConstancia,
      plantillaPath,
      camposDinamicos: camposDinamicos.length > 0 ? camposDinamicos : savedConstancia.camposDinamicos,
    }
    updateSection('constancia', updated)
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
                onChange={handlePathChange}
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

