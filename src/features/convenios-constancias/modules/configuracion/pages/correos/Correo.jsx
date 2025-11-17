import { useState, useEffect } from 'react'
import { Save } from 'lucide-react'
import { Input } from '@shared/components/Input'
import { Textarea } from '@shared/components/Textarea'
import { Button } from '@shared/components/Button'
import { useToast } from '@shared/components/Toast'
import { useConfiguracion } from '../../hooks/useConfiguracion'
import styles from './Correo.module.css'

export default function Correo() {
  const toast = useToast()
  const { getSection, updateSection, loading } = useConfiguracion()
  const [plantillas, setPlantillas] = useState({
    compromisosInternos: {
      asunto: '',
      cuerpo: '',
    },
    documentosSenati: {
      asunto: '',
      cuerpo: '',
    },
  })

  // Cargar plantillas al montar
  useEffect(() => {
    if (!loading) {
      const savedCorreos = getSection('correos')
      if (savedCorreos) {
        setPlantillas(savedCorreos)
      }
    }
  }, [loading, getSection])

  const handleAsuntoChange = (tipo, value) => {
    const updated = {
      ...plantillas,
      [tipo]: {
        ...plantillas[tipo],
        asunto: value,
      },
    }
    setPlantillas(updated)
    // Guardar automáticamente
    updateSection('correos', updated)
  }

  const handleCuerpoChange = (tipo, value) => {
    const updated = {
      ...plantillas,
      [tipo]: {
        ...plantillas[tipo],
        cuerpo: value,
      },
    }
    setPlantillas(updated)
    // Guardar automáticamente
    updateSection('correos', updated)
  }

  const handleGuardar = () => {
    updateSection('correos', plantillas)
    toast.success('Plantillas de correo guardadas correctamente')
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Plantillas de Correo Electrónico</h2>
        <p className={styles.subtitle}>
          Personaliza los mensajes enviados a los estudiantes
        </p>
      </div>

      {/* Plantilla Compromisos Internos */}
      <div className={styles.plantillaCard}>
        <div className={styles.plantillaHeader}>
          <h3 className={styles.plantillaName}>Compromisos Internos</h3>
        </div>
        <div className={styles.plantillaForm}>
          <Input
            label="Asunto - Compromisos Internos"
            value={plantillas.compromisosInternos.asunto}
            onChange={(e) => handleAsuntoChange('compromisosInternos', e.target.value)}
            className={styles.asuntoInput}
          />
          <Textarea
            label="Cuerpo del mensaje"
            value={plantillas.compromisosInternos.cuerpo}
            onChange={(e) => handleCuerpoChange('compromisosInternos', e.target.value)}
            rows={12}
            className={styles.cuerpoTextarea}
          />
        </div>
      </div>

      {/* Plantilla Documentos SENATI */}
      <div className={styles.plantillaCard}>
        <div className={styles.plantillaHeader}>
          <h3 className={styles.plantillaName}>Documentos SENATI</h3>
        </div>
        <div className={styles.plantillaForm}>
          <Input
            label="Asunto - Documentos SENATI"
            value={plantillas.documentosSenati.asunto}
            onChange={(e) => handleAsuntoChange('documentosSenati', e.target.value)}
            className={styles.asuntoInput}
          />
          <Textarea
            label="Cuerpo del mensaje"
            value={plantillas.documentosSenati.cuerpo}
            onChange={(e) => handleCuerpoChange('documentosSenati', e.target.value)}
            rows={12}
            className={styles.cuerpoTextarea}
          />
        </div>
      </div>

      {/* Botón guardar */}
      <div className={styles.saveSection}>
        <Button
          variant="primary"
          icon={Save}
          onClick={handleGuardar}
          size="lg"
        >
          Guardar Cambios
        </Button>
      </div>
    </div>
  )
}

