import { useState, useEffect } from 'react'
import { X, FileJson, Copy, Check, AlertCircle, Loader2 } from 'lucide-react'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/theme-monokai'
import 'ace-builds/src-noconflict/ext-language_tools'
import { createEvaluationFromJson } from '../../services/convocatoriaService'
import { useToast } from '@shared/components/Toast'
import styles from './CreateEvaluationFromJsonModal.module.css'

const JSON_EXAMPLES = {
  profile: {
    evaluation: {
      title: 'Encuesta de Perfil',
      description: 'Esta encuesta recopila información sobre tu perfil profesional, experiencia laboral, habilidades y conocimientos. Nos ayuda a conocer mejor tu trayectoria y competencias.',
      evaluation_type: 'profile',
      job_posting_id: null, // Se reemplazará con el ID real
      time_limit_minutes: 30,
      passing_score: 70.0,
      max_attempts: 3,
      is_active: true
    },
    questions: [
      {
        text: '¿Cuántos años de experiencia tienes?',
        order: 1,
        question_type: 'multiple_choice',
        points: 1.0,
        options: [
          {
            text: 'Menos de 1 año',
            is_correct: false,
            order: 1
          },
          {
            text: 'De 1 a 3 años',
            is_correct: true,
            order: 2
          },
          {
            text: 'Más de 3 años',
            is_correct: false,
            order: 3
          }
        ]
      },
      {
        text: '¿Qué tecnologías conoces?',
        order: 2,
        question_type: 'multiple_choice',
        points: 2.0,
        options: [
          {
            text: 'React',
            is_correct: true,
            order: 1
          },
          {
            text: 'Vue',
            is_correct: true,
            order: 2
          },
          {
            text: 'Angular',
            is_correct: false,
            order: 3
          }
        ]
      }
    ]
  },
  technical: {
    evaluation: {
      title: 'Evaluación Técnica',
      description: 'Esta evaluación mide tus conocimientos técnicos específicos relacionados con el puesto. Incluye preguntas sobre tecnologías, herramientas y conceptos relevantes para la posición.',
      evaluation_type: 'technical',
      job_posting_id: null,
      time_limit_minutes: 60,
      passing_score: 70.0,
      max_attempts: 2,
      is_active: true
    },
    questions: [
      {
        text: '¿Qué es React?',
        order: 1,
        question_type: 'multiple_choice',
        points: 2.0,
        options: [
          {
            text: 'Un framework de JavaScript',
            is_correct: false,
            order: 1
          },
          {
            text: 'Una librería de JavaScript para construir interfaces',
            is_correct: true,
            order: 2
          },
          {
            text: 'Un lenguaje de programación',
            is_correct: false,
            order: 3
          }
        ]
      }
    ]
  },
  psychological: {
    evaluation: {
      title: 'Evaluación Psicológica',
      description: 'Esta evaluación analiza aspectos psicológicos y de personalidad que son importantes para el desempeño en el puesto. Nos ayuda a entender tu perfil de trabajo en equipo, comunicación y adaptabilidad.',
      evaluation_type: 'psychological',
      job_posting_id: null,
      time_limit_minutes: 45,
      passing_score: 60.0,
      max_attempts: 1,
      is_active: true
    },
    questions: [
      {
        text: '¿Cómo prefieres trabajar?',
        order: 1,
        question_type: 'multiple_choice',
        points: 1.0,
        options: [
          {
            text: 'Solo',
            is_correct: false,
            order: 1
          },
          {
            text: 'En equipo',
            is_correct: true,
            order: 2
          },
          {
            text: 'Ambas',
            is_correct: true,
            order: 3
          }
        ]
      }
    ]
  },
  motivation: {
    evaluation: {
      title: 'Evaluación de Motivación',
      description: 'Esta evaluación explora tus motivaciones, expectativas y objetivos profesionales. Nos permite conocer qué te impulsa, qué buscas en esta oportunidad y cómo te alineas con nuestros valores organizacionales.',
      evaluation_type: 'motivation',
      job_posting_id: null,
      time_limit_minutes: 30,
      passing_score: 50.0,
      max_attempts: 1,
      is_active: true
    },
    questions: [
      {
        text: '¿Qué te motiva en el trabajo?',
        order: 1,
        question_type: 'multiple_choice',
        points: 1.0,
        options: [
          {
            text: 'El salario',
            is_correct: false,
            order: 1
          },
          {
            text: 'El crecimiento profesional',
            is_correct: true,
            order: 2
          },
          {
            text: 'El ambiente laboral',
            is_correct: true,
            order: 3
          }
        ]
      }
    ]
  }
}

export function CreateEvaluationFromJsonModal({ isOpen, onClose, jobPostingId, evaluationType, onSuccess }) {
  const toast = useToast()
  const [jsonValue, setJsonValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [jsonError, setJsonError] = useState(null)
  const [copied, setCopied] = useState(false)
  const [showExample, setShowExample] = useState(false)
  const [isLoadingFile, setIsLoadingFile] = useState(false)
  const [isFormatting, setIsFormatting] = useState(false)

  useEffect(() => {
    if (isOpen && evaluationType) {
      // Cargar ejemplo cuando se abre el modal
      const example = JSON_EXAMPLES[evaluationType]
      if (example) {
        // Reemplazar job_posting_id con el ID real
        const exampleWithId = {
          ...example,
          evaluation: {
            ...example.evaluation,
            job_posting_id: jobPostingId
          }
        }
        setJsonValue(JSON.stringify(exampleWithId, null, 2))
        setJsonError(null)
      }
    }
  }, [isOpen, evaluationType, jobPostingId])

  const handleClose = () => {
    setJsonValue('')
    setJsonError(null)
    setCopied(false)
    setShowExample(false)
    onClose()
  }

  const validateJSON = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString)
      
      // Validar estructura básica
      if (!parsed.evaluation || !parsed.questions) {
        throw new Error('El JSON debe contener "evaluation" y "questions"')
      }

      // Validar que job_posting_id coincida
      if (parsed.evaluation.job_posting_id !== jobPostingId) {
        parsed.evaluation.job_posting_id = jobPostingId
      }

      // Validar evaluation_type
      if (parsed.evaluation.evaluation_type !== evaluationType) {
        throw new Error(`El evaluation_type debe ser "${evaluationType}"`)
      }

      // Validar que haya al menos una pregunta
      if (!Array.isArray(parsed.questions) || parsed.questions.length === 0) {
        throw new Error('Debe haber al menos una pregunta en el array "questions"')
      }

      // Validar estructura de preguntas
      parsed.questions.forEach((question, index) => {
        if (!question.text) {
          throw new Error(`La pregunta ${index + 1} debe tener un "text"`)
        }
        if (!Array.isArray(question.options) || question.options.length === 0) {
          throw new Error(`La pregunta ${index + 1} debe tener al menos una opción`)
        }
        question.options.forEach((option, optIndex) => {
          if (!option.text) {
            throw new Error(`La opción ${optIndex + 1} de la pregunta ${index + 1} debe tener un "text"`)
          }
        })
      })

      return parsed
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error('JSON inválido: ' + error.message)
      }
      throw error
    }
  }

  const handleLoadExample = () => {
    // Abrir selector de archivos
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json,application/json'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (!file) {
        setIsLoadingFile(false)
        return
      }

      // Validar que sea un archivo JSON
      if (!file.name.endsWith('.json') && !file.type.includes('json')) {
        toast.error('Por favor, selecciona un archivo JSON válido')
        setIsLoadingFile(false)
        return
      }

      setIsLoadingFile(true)
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const fileContent = event.target.result
          const parsed = JSON.parse(fileContent)

          // Validar estructura básica
          if (!parsed.evaluation || !parsed.questions) {
            throw new Error('El JSON debe contener "evaluation" y "questions"')
          }

          // Asegurar que job_posting_id sea correcto
          parsed.evaluation.job_posting_id = jobPostingId

          // Validar evaluation_type
          if (parsed.evaluation.evaluation_type && parsed.evaluation.evaluation_type !== evaluationType) {
            toast.warning(`El evaluation_type en el archivo es "${parsed.evaluation.evaluation_type}", se cambiará a "${evaluationType}"`)
            parsed.evaluation.evaluation_type = evaluationType
          } else if (!parsed.evaluation.evaluation_type) {
            parsed.evaluation.evaluation_type = evaluationType
          }

          // Formatear y mostrar
          const formattedJson = JSON.stringify(parsed, null, 2)
          setJsonValue(formattedJson)
          setJsonError(null)
          toast.success('Archivo JSON cargado correctamente')
        } catch (error) {
          console.error('Error al leer archivo JSON:', error)
          const errorMessage = error.message || 'Error al leer el archivo JSON'
          setJsonError(errorMessage)
          toast.error(`Error: ${errorMessage}`)
        } finally {
          setIsLoadingFile(false)
        }
      }
      reader.onerror = () => {
        toast.error('Error al leer el archivo')
        setIsLoadingFile(false)
      }
      reader.readAsText(file)
    }
    input.click()
  }

  const handleCopyExample = async () => {
    try {
      const example = JSON_EXAMPLES[evaluationType]
      if (example) {
        const exampleWithId = {
          ...example,
          evaluation: {
            ...example.evaluation,
            job_posting_id: jobPostingId
          }
        }
        const jsonString = JSON.stringify(exampleWithId, null, 2)
        await navigator.clipboard.writeText(jsonString)
        setCopied(true)
        toast.success('Ejemplo copiado al portapapeles')
        setTimeout(() => setCopied(false), 2000)
      }
    } catch (error) {
      toast.error('Error al copiar el ejemplo')
    }
  }

  const handleFormatJSON = () => {
    setIsFormatting(true)
    try {
      const parsed = JSON.parse(jsonValue)
      setJsonValue(JSON.stringify(parsed, null, 2))
      setJsonError(null)
      toast.success('JSON formateado correctamente')
    } catch (error) {
      setJsonError('JSON inválido: ' + error.message)
      toast.error('Error al formatear JSON')
    } finally {
      setIsFormatting(false)
    }
  }

  const handleSubmit = async () => {
    try {
      setJsonError(null)
      setIsLoading(true)

      // Validar JSON
      const validatedData = validateJSON(jsonValue)

      // Crear evaluación
      const result = await createEvaluationFromJson(validatedData)

      toast.success(
        `Evaluación ${result.evaluation?.id ? 'actualizada' : 'creada'} exitosamente. ` +
        `${result.statistics?.questions_created || 0} preguntas creadas.`
      )

      if (result.warnings && result.warnings.length > 0) {
        result.warnings.forEach((warning) => {
          toast.warning(warning)
        })
      }

      handleClose()
      if (onSuccess) {
        onSuccess(result)
      }
    } catch (error) {
      console.error('Error al crear evaluación:', error)
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        'Error al crear la evaluación desde JSON'
      setJsonError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <FileJson size={24} className={styles.icon} />
            <div>
              <h2 className={styles.title}>Crear Evaluación desde JSON</h2>
              <p className={styles.subtitle}>
                Tipo: <strong>{evaluationType}</strong> | Convocatoria ID: <strong>{jobPostingId}</strong>
              </p>
            </div>
          </div>
          <button onClick={handleClose} className={styles.closeButton}>
            <X size={20} />
          </button>
        </div>

        {/* Actions Bar */}
        <div className={styles.actionsBar}>
          <div className={styles.actionsLeft}>
            <button 
              onClick={handleLoadExample} 
              className={styles.actionButton}
              disabled={isLoadingFile}
            >
              {isLoadingFile ? (
                <Loader2 size={16} className={styles.spinner} />
              ) : (
                <FileJson size={16} />
              )}
              {isLoadingFile ? 'Cargando...' : 'Cargar desde Archivo'}
            </button>
            <button 
              onClick={handleCopyExample} 
              className={styles.actionButton}
              disabled={copied}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copiado' : 'Copiar Ejemplo'}
            </button>
            <button 
              onClick={handleFormatJSON} 
              className={styles.actionButton}
              disabled={isFormatting || !jsonValue.trim()}
            >
              {isFormatting ? (
                <Loader2 size={16} className={styles.spinner} />
              ) : null}
              {isFormatting ? 'Formateando...' : 'Formatear JSON'}
            </button>
          </div>
        </div>

        {/* Editor */}
        <div className={styles.editorContainer}>
          <AceEditor
            mode="json"
            theme="monokai"
            value={jsonValue}
            onChange={setJsonValue}
            name="json-editor"
            editorProps={{ $blockScrolling: true }}
            width="100%"
            height="600px"
            fontSize={14}
            showPrintMargin={true}
            showGutter={true}
            highlightActiveLine={true}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: true,
              showLineNumbers: true,
              tabSize: 2,
              useWorker: false
            }}
          />
        </div>

        {/* Error Message */}
        {jsonError && (
          <div className={styles.errorContainer}>
            <AlertCircle size={20} />
            <span className={styles.errorText}>{jsonError}</span>
          </div>
        )}

        {/* Footer */}
        <div className={styles.footer}>
          <button onClick={handleClose} className={styles.cancelButton} disabled={isLoading}>
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className={styles.submitButton}
            disabled={isLoading || !jsonValue.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className={styles.spinner} />
                Creando...
              </>
            ) : (
              'Crear Evaluación'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

