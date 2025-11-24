import { useState, useEffect } from 'react'
import { Save, RotateCcw, Download, Upload, AlertCircle, CheckCircle2 } from 'lucide-react'
import {
  getStoredConfig,
  saveConfig,
  getAllEnvVars,
  resetConfig,
  exportConfig,
  importConfig,
  ENV_VARIABLES,
} from '@shared/utils/envConfig'
import { useToast } from '@shared/components/Toast'
import styles from './VariablesEntornoPage.module.css'

export function VariablesEntornoPage() {
  const toast = useToast()
  const [config, setConfig] = useState({})
  const [originalConfig, setOriginalConfig] = useState({})
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [importValue, setImportValue] = useState('')

  // Cargar configuración al montar el componente
  useEffect(() => {
    loadConfig()
    
    // Escuchar cambios en la configuración desde otras pestañas
    const handleConfigChange = () => {
      loadConfig()
    }
    window.addEventListener('envConfigChanged', handleConfigChange)
    
    return () => {
      window.removeEventListener('envConfigChanged', handleConfigChange)
    }
  }, [])

  const loadConfig = () => {
    const stored = getStoredConfig()
    const allVars = getAllEnvVars()
    
    // Combinar: valores guardados + valores del build
    const combined = {}
    Object.keys(ENV_VARIABLES).forEach((key) => {
      combined[key] = stored[key] !== undefined ? stored[key] : allVars[key] || ''
    })
    
    setConfig(combined)
    setOriginalConfig(JSON.parse(JSON.stringify(combined)))
    setHasChanges(false)
  }

  const handleChange = (key, value) => {
    setConfig((prev) => ({
      ...prev,
      [key]: value,
    }))
    
    // Verificar si hay cambios
    const newConfig = { ...config, [key]: value }
    const hasModifications = JSON.stringify(newConfig) !== JSON.stringify(originalConfig)
    setHasChanges(hasModifications)
  }

  const handleSave = () => {
    setIsSaving(true)
    
    // Validar campos requeridos
    const requiredFields = Object.keys(ENV_VARIABLES).filter(
      (key) => ENV_VARIABLES[key].required && !config[key]
    )
    
    if (requiredFields.length > 0) {
      toast.error(
        `Los siguientes campos son requeridos: ${requiredFields.map((k) => ENV_VARIABLES[k].label).join(', ')}`,
        5000,
        'Campos requeridos'
      )
      setIsSaving(false)
      return
    }

    // Guardar solo los valores que difieren de los valores por defecto del build
    const storedConfig = {}
    Object.keys(config).forEach((key) => {
      const buildValue = import.meta.env[key] || ''
      if (config[key] !== buildValue && config[key] !== '') {
        storedConfig[key] = config[key]
      }
    })

    const success = saveConfig(storedConfig)
    
    if (success) {
      toast.success('Configuración guardada correctamente. Los cambios se aplicarán inmediatamente.', 4000, 'Configuración guardada')
      loadConfig()
      
      // Recargar la página después de un breve delay para aplicar cambios
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } else {
      toast.error('Error al guardar la configuración', 4000, 'Error')
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    if (window.confirm('¿Estás seguro de que deseas resetear la configuración a los valores por defecto del build?')) {
      const success = resetConfig()
      if (success) {
        toast.success('Configuración reseteada correctamente', 3000, 'Configuración reseteada')
        loadConfig()
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      } else {
        toast.error('Error al resetear la configuración', 4000, 'Error')
      }
    }
  }

  const handleExport = () => {
    const json = exportConfig()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rpsoft-env-config-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success('Configuración exportada correctamente', 3000, 'Exportación exitosa')
  }

  const handleImport = () => {
    if (!importValue.trim()) {
      toast.error('Por favor, pega el JSON de configuración', 3000, 'Error')
      return
    }

    const success = importConfig(importValue)
    if (success) {
      toast.success('Configuración importada correctamente', 3000, 'Importación exitosa')
      setImportValue('')
      loadConfig()
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } else {
      toast.error('Error al importar la configuración. Verifica el formato JSON.', 4000, 'Error')
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Configuración de Variables de Entorno</h1>
          <p className={styles.description}>
            Administra las variables de entorno del sistema. Los cambios se aplicarán inmediatamente sin necesidad de recompilar.
          </p>
        </div>
        <div className={styles.actions}>
          <button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className={`${styles.button} ${styles.buttonPrimary}`}
          >
            <Save size={18} />
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
          <button
            onClick={handleReset}
            className={`${styles.button} ${styles.buttonSecondary}`}
            title="Resetear a valores por defecto del build"
          >
            <RotateCcw size={18} />
            Resetear
          </button>
        </div>
      </div>

      {hasChanges && (
        <div className={styles.alert}>
          <AlertCircle size={18} />
          <span>Tienes cambios sin guardar</span>
        </div>
      )}

      <div className={styles.content}>
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Variables de Entorno</h2>
          
          <div className={styles.variablesGrid}>
            {Object.keys(ENV_VARIABLES).map((key) => {
              const variable = ENV_VARIABLES[key]
              const value = config[key] || ''
              const isPassword = key.includes('CLIENT_ID') || key.includes('API_KEY') || key.includes('SECRET')
              
              return (
                <div key={key} className={styles.variableCard}>
                  <label className={styles.label}>
                    {variable.label}
                    {variable.required && <span className={styles.required}>*</span>}
                  </label>
                  {variable.description && (
                    <p className={styles.description}>{variable.description}</p>
                  )}
                  <div className={styles.inputWrapper}>
                    <input
                      type={isPassword ? 'password' : variable.type === 'url' ? 'url' : 'text'}
                      value={value}
                      onChange={(e) => handleChange(key, e.target.value)}
                      placeholder={variable.default || `Valor para ${variable.label}`}
                      className={styles.input}
                      required={variable.required}
                    />
                    {value && (
                      <div className={styles.valueIndicator}>
                        <CheckCircle2 size={14} />
                      </div>
                    )}
                  </div>
                  <div className={styles.metaInfo}>
                    <span className={styles.keyName}>{key}</span>
                    {import.meta.env[key] && (
                      <span className={styles.buildValue}>
                        Valor del build: {import.meta.env[key].substring(0, 30)}...
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className={styles.importExportWrapper}>
          <h2 className={styles.sectionTitle}>Importar / Exportar Configuración</h2>
          
          <div className={styles.importExportSection}>
            <div className={styles.exportCard}>
              <h3 className={styles.cardTitle}>Exportar Configuración</h3>
              <p className={styles.cardDescription}>
                Descarga la configuración actual como archivo JSON para respaldar o compartir.
              </p>
              <button
                onClick={handleExport}
                className={`${styles.button} ${styles.buttonSecondary}`}
              >
                <Download size={18} />
                Exportar JSON
              </button>
            </div>

            <div className={styles.importCard}>
              <h3 className={styles.cardTitle}>Importar Configuración</h3>
              <p className={styles.cardDescription}>
                Restaura una configuración desde un archivo JSON exportado previamente.
              </p>
              <textarea
                value={importValue}
                onChange={(e) => setImportValue(e.target.value)}
                placeholder='Pega aquí el contenido del archivo JSON...'
                className={styles.textarea}
                rows={6}
              />
              <button
                onClick={handleImport}
                disabled={!importValue.trim()}
                className={`${styles.button} ${styles.buttonPrimary}`}
              >
                <Upload size={18} />
                Importar JSON
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.infoBox}>
        <AlertCircle size={18} />
        <div>
          <strong>Nota importante:</strong>
          <ul>
            <li>Los cambios se guardan en el navegador (localStorage) y persisten después del build.</li>
            <li>La configuración dinámica tiene prioridad sobre los valores del build.</li>
            <li>Al resetear, se restauran los valores originales del build.</li>
            <li>Los campos marcados con * son requeridos.</li>
            <li>Después de guardar, la página se recargará automáticamente para aplicar los cambios.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

