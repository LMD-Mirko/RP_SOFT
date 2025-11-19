import { useState, useEffect } from 'react'
import { X, FileJson, Copy, Check, AlertCircle, Loader2 } from 'lucide-react'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/theme-monokai'
import 'ace-builds/src-noconflict/ext-language_tools'
import { createExamFromJson } from '../../services'
import { useToast } from '@shared/components/Toast'
import styles from './CreateExamFromJsonModal.module.css'

const JSON_EXAMPLE = {
  exam: {
    title: 'Examen de React Avanzado',
    description: 'Evaluación de conocimientos en React, Hooks y Redux',
    start_date: '2025-11-20T00:00:00Z',
    end_date: '2025-11-25T23:59:59Z',
    time_limit_minutes: 90,
    passing_score: 14.0,
    max_attempts: 3,
    is_active: true
  },
  questions: [
    {
      text: '¿Qué es un Hook en React?',
      order: 1,
      question_type: 'multiple_choice',
      points: 1.0,
      answer_options: [
        {
          text: 'Una función que permite usar estado y otras características de React',
          is_correct: true,
          order: 1
        },
        {
          text: 'Un componente de React',
          is_correct: false,
          order: 2
        },
        {
          text: 'Un método de ciclo de vida',
          is_correct: false,
          order: 3
        }
      ]
    },
    {
      text: '¿Cuál es la diferencia entre useState y useReducer?',
      order: 2,
      question_type: 'multiple_choice',
      points: 2.0,
      answer_options: [
        {
          text: 'useState es para estado simple, useReducer para estado complejo',
          is_correct: true,
          order: 1
        },
        {
          text: 'No hay diferencia',
          is_correct: false,
          order: 2
        }
      ]
    }
  ]
}

export function CreateExamFromJsonModal({ isOpen, onClose, onSuccess }) {
  const toast = useToast()
  const [jsonValue, setJsonValue] = useState('')
  const [jsonError, setJsonError] = useState(null)
  const [copied, setCopied] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingFile, setIsLoadingFile] = useState(false)
  const [isFormatting, setIsFormatting] = useState(false)

  useEffect(() => {
    if (isOpen && !jsonValue) {
      const exampleJson = JSON.stringify(JSON_EXAMPLE, null, 2)
      setJsonValue(exampleJson)
      setJsonError(null)
      setCopied(false)
    }
  }, [isOpen])

  const handleClose = () => {
    setJsonValue('')
    setJsonError(null)
    setCopied(false)
    onClose()
  }

  const validateJSON = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString)
      
      if (!parsed.exam || !parsed.questions) {
        throw new Error('El JSON debe contener "exam" y "questions"')
      }

      if (!Array.isArray(parsed.questions) || parsed.questions.length === 0) {
        throw new Error('Debe haber al menos una pregunta en el array "questions"')
      }

      // Limpiar y validar el objeto exam - solo campos permitidos
      const cleanExam = {
        title: parsed.exam.title,
        description: parsed.exam.description,
        start_date: parsed.exam.start_date,
        end_date: parsed.exam.end_date,
        time_limit_minutes: parsed.exam.time_limit_minutes,
        passing_score: parsed.exam.passing_score,
        max_attempts: parsed.exam.max_attempts,
        is_active: parsed.exam.is_active !== undefined ? parsed.exam.is_active : true
      }

      // Limpiar y validar preguntas
      const cleanQuestions = parsed.questions.map((question, index) => {
        if (!question.text) {
          throw new Error(`La pregunta ${index + 1} debe tener un "text"`)
        }
        
        const cleanQuestion = {
          text: question.text,
          order: question.order || index + 1,
          question_type: question.question_type || 'multiple_choice',
          points: question.points || 1.0
        }

        // Limpiar answer_options si existen
        if (question.answer_options && Array.isArray(question.answer_options)) {
          if (question.answer_options.length === 0) {
            throw new Error(`La pregunta ${index + 1} debe tener al menos una opción de respuesta`)
          }
          cleanQuestion.answer_options = question.answer_options.map((option, optIndex) => ({
            text: option.text,
            is_correct: option.is_correct || false,
            order: option.order || optIndex + 1
          }))
        } else if (question.question_type === 'multiple_choice' || question.question_type === 'true_false') {
          throw new Error(`La pregunta ${index + 1} debe tener al menos una opción de respuesta`)
        }

        return cleanQuestion
      })

      return {
        exam: cleanExam,
        questions: cleanQuestions
      }
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error('JSON inválido: ' + error.message)
      }
      throw error
    }
  }

  const handleLoadExample = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json,application/json'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (!file) {
        setIsLoadingFile(false)
        return
      }

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

          if (!parsed.exam || !parsed.questions) {
            throw new Error('El JSON debe contener "exam" y "questions"')
          }

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
      const jsonString = JSON.stringify(JSON_EXAMPLE, null, 2)
      await navigator.clipboard.writeText(jsonString)
      setCopied(true)
      toast.success('Ejemplo copiado al portapapeles')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Error al copiar al portapapeles')
    }
  }

  const handleFormatJSON = () => {
    setIsFormatting(true)
    try {
      const parsed = JSON.parse(jsonValue)
      const formatted = JSON.stringify(parsed, null, 2)
      setJsonValue(formatted)
      setJsonError(null)
      toast.success('JSON formateado correctamente')
    } catch (error) {
      setJsonError('Error al formatear JSON: ' + error.message)
      toast.error('Error al formatear JSON')
    } finally {
      setIsFormatting(false)
    }
  }

  const handleSubmit = async () => {
    if (!jsonValue.trim()) {
      toast.error('Por favor, ingresa un JSON válido')
      return
    }

    try {
      setIsSubmitting(true)
      setJsonError(null)

      const parsed = validateJSON(jsonValue)
      const response = await createExamFromJson(parsed)
      
      toast.success('Examen creado exitosamente')
      handleClose()
      if (onSuccess) {
        onSuccess(response)
      }
    } catch (error) {
      console.error('Error al crear examen:', error)
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        'Error al crear el examen'
      setJsonError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (jsonValue) {
      try {
        validateJSON(jsonValue)
        setJsonError(null)
      } catch (error) {
        if (error.message !== jsonError) {
          setJsonError(error.message)
        }
      }
    }
  }, [jsonValue])

  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Crear Examen desde JSON</h2>
          <button onClick={handleClose} className={styles.closeButton}>
            <X size={24} />
          </button>
        </div>

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
            }}
          />
        </div>

        {jsonError && (
          <div className={styles.errorContainer}>
            <AlertCircle size={20} />
            <span className={styles.errorText}>{jsonError}</span>
          </div>
        )}

        <div className={styles.footer}>
          <button onClick={handleClose} className={styles.cancelButton}>
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className={styles.submitButton}
            disabled={isSubmitting || !!jsonError || !jsonValue.trim()}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className={styles.spinner} />
                Creando...
              </>
            ) : (
              'Crear Examen'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

