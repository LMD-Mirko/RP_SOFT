import { useState, useEffect, useCallback } from 'react'
import { AlertCircle, Upload, Trash2, Edit, Save, Info, X } from 'lucide-react'
import { Input } from '@shared/components/Input'
import { Button } from '@shared/components/Button'
import { useToast } from '@shared/components/Toast'
import { EditorFirmaModal } from '../../components/EditorFirmaModal'
import { useConfiguracion } from '../../hooks/useConfiguracion'
import { 
  saveImageAsBase64, 
  validateImageFile, 
  validateFirmaData,
  getImageDimensions 
} from '../../services/configuracionService'
import Compromiso from '../compromiso/Compromiso'
import Constacia from '../constancia/Constacia'
import Correo from '../correos/Correo'
import FirmaEstudiante from '../firmaEstudiante/FirmaEstudiante'
import styles from './Configuracion.module.css'

const tabs = [
  { id: 'firma-empresa', label: 'Firma Empresa' },
  { id: 'compromisos', label: 'Compromisos' },
  { id: 'constancia', label: 'Constancia' },
  { id: 'firma-estudiante', label: 'Firma Estudiante' },
  { id: 'correos', label: 'Correos' },
]

export default function Configuracion() {
  const toast = useToast()
  const { getSection, updateSection, loading } = useConfiguracion()
  const [activeTab, setActiveTab] = useState('firma-empresa')
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [isEditorSelloOpen, setIsEditorSelloOpen] = useState(false)
  const [documentoCargado, setDocumentoCargado] = useState(null)
  const [documentoPreview, setDocumentoPreview] = useState(null)
  const [firmaEmpresa, setFirmaEmpresa] = useState({
    imagen: null,
    preview: null,
    posicion: { x: 0, y: 0 },
    size: { width: 200, height: 100 },
  })
  const [selloEmpresa, setSelloEmpresa] = useState({
    imagen: null,
    preview: null,
    posicion: { x: 0, y: 0 },
    size: { width: 200, height: 200 },
  })
  const [documentoConFirma, setDocumentoConFirma] = useState(null)
  const [pdfContainerRef, setPdfContainerRef] = useState(null)
  const [pdfScale, setPdfScale] = useState({ scaleX: 1, scaleY: 1 })
  const [posicionesFirma, setPosicionesFirma] = useState({
    convenioTripartito: {
      pagina: 'Ultima',
      posicionX: 'Ultima',
      posicionY: 'Ultima',
    },
    constanciaPracticas: {
      pagina: 'Ultima',
      posicionX: 'Ultima',
      posicionY: 'Ultima',
    },
  })

  // Cargar configuraciones al montar
  useEffect(() => {
    if (!loading) {
      const savedFirma = getSection('firmaEmpresa')
      const savedSello = getSection('selloEmpresa')
      const savedPosiciones = getSection('posicionesFirma')

      if (savedFirma) {
        // Validar y restaurar firma
        const validation = validateFirmaData(savedFirma)
        if (validation.valid) {
          setFirmaEmpresa(savedFirma)
          
          // Si hay un documento cargado y la firma tiene posición, mostrar overlay
          if (documentoCargado && savedFirma.posicion && savedFirma.preview) {
            // Para PDFs, guardar información de firma en documentoConFirma
            if (documentoCargado.type === 'application/pdf') {
              setDocumentoConFirma({
                isPdf: true,
                firmaPreview: savedFirma.preview,
                firmaPosition: savedFirma.posicion,
                firmaSize: savedFirma.size,
              })
            }
          }
        } else {
          // Solo mostrar warning si realmente hay datos pero están incompletos
          // No mostrar si simplemente no hay datos guardados (valores por defecto)
          // Solo en desarrollo y si hay datos parciales
          if (import.meta.env.DEV && (savedFirma.imagen || savedFirma.preview)) {
            // Silenciar warnings de validación en desarrollo cuando no hay backend
          }
        }
      }
      
      if (savedSello) {
        // Validar y restaurar sello
        const validation = validateFirmaData(savedSello)
        if (validation.valid) {
          setSelloEmpresa(savedSello)
        } else {
          // Solo mostrar warning si realmente hay datos pero están incompletos
          // Solo en desarrollo y si hay datos parciales
          if (import.meta.env.DEV && (savedSello.imagen || savedSello.preview)) {
            // Silenciar warnings de validación en desarrollo cuando no hay backend
          }
        }
      }
      
      if (savedPosiciones) {
        setPosicionesFirma(savedPosiciones)
      }
    }
  }, [loading, getSection, documentoCargado])

  // Calcular escala del PDF cuando cambia el tamaño del contenedor
  useEffect(() => {
    if (!pdfContainerRef || !documentoCargado || documentoCargado.type !== 'application/pdf') {
      return
    }

    const container = pdfContainerRef
    if (!container) return

    const iframe = container.querySelector('iframe')
    if (!iframe) return

    // Esperar a que el iframe se cargue
    const handleIframeLoad = () => {
      try {
        // Dimensiones del iframe
        const iframeRect = iframe.getBoundingClientRect()
        const iframeWidth = iframeRect.width

        // Tamaño estándar del documento en el editor (800x1000 es el tamaño por defecto)
        // Este es el tamaño de referencia usado en el EditorFirmaModal
        const editorWidth = 800

        // Calcular escala basándose en el ancho (más confiable que el alto para PDFs)
        // Usar la misma escala para X e Y para mantener proporciones
        const scale = iframeWidth / editorWidth

        setPdfScale({ scaleX: scale, scaleY: scale })
      } catch (error) {
        console.error('Error al calcular escala del PDF:', error)
      }
    }

    // Si el iframe ya está cargado, calcular inmediatamente
    if (iframe.contentDocument?.readyState === 'complete') {
      handleIframeLoad()
    } else {
      iframe.addEventListener('load', handleIframeLoad, { once: true })
    }

    // También calcular cuando cambia el tamaño
    const resizeObserver = new ResizeObserver(() => {
      setTimeout(handleIframeLoad, 100) // Pequeño delay para que el iframe se ajuste
    })
    
    if (pdfContainerRef) {
      resizeObserver.observe(pdfContainerRef)
    }

    // Pequeño delay para asegurar que el DOM esté listo
    const timeoutId = setTimeout(handleIframeLoad, 200)

    return () => {
      clearTimeout(timeoutId)
      resizeObserver.disconnect()
      iframe.removeEventListener('load', handleIframeLoad)
    }
  }, [pdfContainerRef, documentoCargado, documentoPreview])

  // Mostrar firma cuando se carga un documento y hay firma guardada
  useEffect(() => {
    if (documentoCargado && documentoPreview && firmaEmpresa.preview && firmaEmpresa.posicion) {
      // Si es PDF y no hay documentoConFirma configurado, configurarlo
      if (documentoCargado.type === 'application/pdf' && !documentoConFirma?.firmaPreview) {
        setDocumentoConFirma({
          isPdf: true,
          firmaPreview: firmaEmpresa.preview,
          firmaPosition: firmaEmpresa.posicion,
          firmaSize: firmaEmpresa.size,
        })
      }
    }
  }, [documentoCargado, documentoPreview, firmaEmpresa.preview, firmaEmpresa.posicion, firmaEmpresa.size, documentoConFirma])

  // Limpiar URLs de blob al desmontar
  useEffect(() => {
    return () => {
      if (documentoPreview?.startsWith('blob:')) {
        URL.revokeObjectURL(documentoPreview)
      }
      if (documentoConFirma?.url?.startsWith('blob:')) {
        URL.revokeObjectURL(documentoConFirma.url)
      }
    }
  }, [documentoPreview, documentoConFirma])

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar archivo
    const validation = validateImageFile(file)
    if (!validation.valid) {
      toast.error(validation.error)
      e.target.value = '' // Limpiar input
      return
    }

    try {
      // Mostrar loading
      toast.info('Procesando imagen...')
      
      // Guardar imagen optimizada
      const preview = await saveImageAsBase64(file, {
        optimize: true,
        maxWidth: 2000,
        maxHeight: 2000,
        quality: 0.85,
      })

      // Obtener dimensiones originales para mantener proporción
      const dimensions = await getImageDimensions(preview)
      
      // Calcular tamaño inicial manteniendo proporción (máx 200x100)
      const maxWidth = 200
      const maxHeight = 100
      let width = dimensions.width
      let height = dimensions.height
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        width = Math.round(width * ratio)
        height = Math.round(height * ratio)
      }

      const updated = {
        ...firmaEmpresa,
        imagen: file.name,
        preview: preview,
        size: {
          width: width,
          height: height,
        },
        originalDimensions: dimensions, // Guardar dimensiones originales
        uploadedAt: new Date().toISOString(),
      }

      setFirmaEmpresa(updated)
      await updateSection('firmaEmpresa', updated)
      toast.success('Firma cargada y optimizada correctamente')
    } catch (error) {
      console.error('Error al procesar imagen:', error)
      toast.error(error.message || 'Error al cargar la imagen')
      e.target.value = '' // Limpiar input en caso de error
    }
  }

  const handleDocumentoChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setDocumentoCargado(file)
      if (file.type === 'application/pdf') {
        const url = URL.createObjectURL(file)
        setDocumentoPreview(url)
      } else {
        const reader = new FileReader()
        reader.onloadend = () => {
          setDocumentoPreview(reader.result)
        }
        reader.readAsDataURL(file)
      }
      toast.success('Documento cargado correctamente')
    }
  }


  const handleDeleteFirma = useCallback(async () => {
    // Confirmar eliminación
    if (!firmaEmpresa.preview) {
      toast.info('No hay firma para eliminar')
      return
    }

    const defaultFirma = {
      imagen: null,
      preview: null,
      posicion: { x: 0, y: 0 },
      size: { width: 200, height: 100 },
      originalDimensions: null,
      uploadedAt: null,
    }
    
    try {
      setFirmaEmpresa(defaultFirma)
      await updateSection('firmaEmpresa', defaultFirma)
      toast.success('Firma eliminada correctamente')
    } catch (error) {
      toast.error('Error al eliminar la firma: ' + (error.message || 'Error desconocido'))
    }
  }, [firmaEmpresa.preview, updateSection, toast])

  const handleSelloChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar archivo
    const validation = validateImageFile(file)
    if (!validation.valid) {
      toast.error(validation.error)
      e.target.value = ''
      return
    }

    try {
      toast.info('Procesando sello...')
      
      const preview = await saveImageAsBase64(file, {
        optimize: true,
        maxWidth: 2000,
        maxHeight: 2000,
        quality: 0.85,
      })

      const dimensions = await getImageDimensions(preview)
      
      // Calcular tamaño inicial para sello (máx 200x200, mantener cuadrado si es posible)
      const maxSize = 200
      let width = dimensions.width
      let height = dimensions.height
      
      if (width > maxSize || height > maxSize) {
        const ratio = Math.min(maxSize / width, maxSize / height)
        width = Math.round(width * ratio)
        height = Math.round(height * ratio)
      }

      const updated = {
        ...selloEmpresa,
        imagen: file.name,
        preview: preview,
        size: {
          width: width,
          height: height,
        },
        originalDimensions: dimensions,
        uploadedAt: new Date().toISOString(),
      }

      setSelloEmpresa(updated)
      await updateSection('selloEmpresa', updated)
      toast.success('Sello cargado y optimizado correctamente')
    } catch (error) {
      console.error('Error al procesar sello:', error)
      toast.error(error.message || 'Error al cargar el sello')
      e.target.value = ''
    }
  }

  const handleDeleteSello = useCallback(async () => {
    if (!selloEmpresa.preview) {
      toast.info('No hay sello para eliminar')
      return
    }

    const defaultSello = {
      imagen: null,
      preview: null,
      posicion: { x: 0, y: 0 },
      size: { width: 200, height: 200 },
      originalDimensions: null,
      uploadedAt: null,
    }
    
    try {
      setSelloEmpresa(defaultSello)
      await updateSection('selloEmpresa', defaultSello)
      toast.success('Sello eliminado correctamente')
    } catch (error) {
      toast.error('Error al eliminar el sello: ' + (error.message || 'Error desconocido'))
    }
  }, [selloEmpresa.preview, updateSection, toast])

  const handleSaveSello = useCallback(async () => {
    const validation = validateFirmaData(selloEmpresa)
    if (!validation.valid) {
      toast.error(validation.error)
      return
    }

    if (!selloEmpresa.preview) {
      toast.error('Por favor carga un sello antes de guardar')
      return
    }

    try {
      await updateSection('selloEmpresa', selloEmpresa)
      toast.success('Sello guardado correctamente')
    } catch (error) {
      toast.error('Error al guardar el sello: ' + (error.message || 'Error desconocido'))
    }
  }, [selloEmpresa, updateSection, toast])

  const handleEditSello = () => {
    if (!documentoCargado) {
      toast.warning('Por favor carga un documento primero')
      return
    }
    setIsEditorSelloOpen(true)
  }

  const handleSaveSelloEditado = useCallback(async (data) => {
    try {
      // Validar datos recibidos
      if (!data) {
        toast.error('No se recibieron datos válidos')
        return
      }

      // Construir objeto de sello actualizado
      const updatedSello = {
        ...selloEmpresa,
        imagen: data.firma?.name || selloEmpresa.imagen || 'sello-empresa',
        preview: data.firmaPreview || selloEmpresa.preview,
        posicion: data.posicion || selloEmpresa.posicion || { x: 0, y: 0 },
        size: data.size || selloEmpresa.size || { width: 200, height: 200 },
        zoom: data.zoom || 1,
        lastEdited: new Date().toISOString(),
      }

      // Validar sello antes de guardar
      const validation = validateFirmaData(updatedSello)
      if (!validation.valid) {
        toast.error(validation.error)
        return
      }

      // Actualizar estado
      setSelloEmpresa(updatedSello)
      await updateSection('selloEmpresa', updatedSello)

      // Manejar documento con sello aplicado
      if (data.documentoConFirma) {
        if (data.documentoConFirma.isPdf) {
          // Para PDFs, solo guardamos la información de posición
          toast.success('Sello posicionado correctamente. Para PDFs, el sello se aplicará al generar el documento final.')
        } else if (data.documentoConFirma.url && data.documentoConFirma.blob) {
          // Revocar URL anterior si existe y es diferente
          if (documentoPreview?.startsWith('blob:') && documentoPreview !== data.documentoConFirma.url) {
            URL.revokeObjectURL(documentoPreview)
          }
          
          setDocumentoPreview(data.documentoConFirma.url)
          toast.success('Sello posicionado y documento guardado correctamente')
        } else {
          toast.success('Sello posicionado correctamente en el documento')
        }
      } else {
        toast.success('Sello posicionado y guardado correctamente')
      }
    } catch (error) {
      console.error('Error al guardar sello editado:', error)
      toast.error('Error al guardar el sello: ' + (error.message || 'Error desconocido'))
    }
  }, [selloEmpresa, documentoPreview, updateSection, toast])

  const handleSaveFirma = useCallback(async () => {
    // Validar antes de guardar
    const validation = validateFirmaData(firmaEmpresa)
    if (!validation.valid) {
      toast.error(validation.error)
      return
    }

    if (!firmaEmpresa.preview) {
      toast.error('Por favor carga una firma antes de guardar')
      return
    }

    try {
      await updateSection('firmaEmpresa', firmaEmpresa)
      toast.success('Firma guardada correctamente')
    } catch (error) {
      toast.error('Error al guardar la firma: ' + (error.message || 'Error desconocido'))
    }
  }, [firmaEmpresa, updateSection, toast])

  const handleEditFirma = () => {
    setIsEditorOpen(true)
  }

  const handleSaveFirmaEditada = useCallback(async (data) => {
    try {
      // Validar datos recibidos
      if (!data) {
        toast.error('No se recibieron datos válidos')
        return
      }

      // Construir objeto de firma actualizado
      const updatedFirma = {
        ...firmaEmpresa,
        imagen: data.firma?.name || firmaEmpresa.imagen || 'firma-empresa',
        preview: data.firmaPreview || firmaEmpresa.preview,
        posicion: data.posicion || firmaEmpresa.posicion || { x: 0, y: 0 },
        size: data.size || firmaEmpresa.size || { width: 200, height: 100 },
        zoom: data.zoom || 1,
        lastEdited: new Date().toISOString(),
      }

      // Validar firma antes de guardar
      const validation = validateFirmaData(updatedFirma)
      if (!validation.valid) {
        toast.error(validation.error)
        return
      }

      // Actualizar estado
      setFirmaEmpresa(updatedFirma)
      await updateSection('firmaEmpresa', updatedFirma)

      // Manejar documento con firma aplicada
      if (data.documentoConFirma) {
        if (data.documentoConFirma.isPdf) {
          // Para PDFs, guardamos la información de posición y mostramos overlay
          // Guardamos el documento con firma para mostrar el overlay
          setDocumentoConFirma({
            ...data.documentoConFirma,
            firmaPreview: data.firmaPreview,
            firmaPosition: data.posicion,
            firmaSize: data.size,
          })
          toast.success('Firma posicionada correctamente. La firma se aplicará al generar el documento final.')
        } else if (data.documentoConFirma.url && data.documentoConFirma.blob) {
          // Revocar URL anterior si existe y es diferente
          if (documentoPreview?.startsWith('blob:') && documentoPreview !== data.documentoConFirma.url) {
            URL.revokeObjectURL(documentoPreview)
          }
          
          setDocumentoConFirma(data.documentoConFirma)
          setDocumentoPreview(data.documentoConFirma.url)
          toast.success('Firma posicionada y documento guardado correctamente')
        } else {
          setDocumentoConFirma(null)
          toast.success('Firma posicionada correctamente en el documento')
        }
      } else {
        toast.success('Firma posicionada y guardada correctamente')
      }
    } catch (error) {
      console.error('Error al guardar firma editada:', error)
      toast.error('Error al guardar la firma: ' + (error.message || 'Error desconocido'))
    }
  }, [firmaEmpresa, documentoPreview, updateSection, toast])

  const handlePosicionChange = async (documento, campo, valor) => {
    const updated = {
      ...posicionesFirma,
      [documento]: {
        ...posicionesFirma[documento],
        [campo]: valor,
      },
    }
    setPosicionesFirma(updated)
    // Guardar automáticamente
    try {
      await updateSection('posicionesFirma', updated)
    } catch (error) {
      console.error('Error al guardar posiciones:', error)
    }
  }

  const handleSavePosiciones = async () => {
    try {
      await updateSection('posicionesFirma', posicionesFirma)
      toast.success('Posiciones guardadas correctamente')
    } catch (error) {
      toast.error('Error al guardar las posiciones: ' + (error.message || 'Error desconocido'))
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Configuracion - RP Firma</h1>
        <p className={styles.subtitle}>
          Gestiona plantillas, firmas y configuraciones del sistema
        </p>
      </div>

      {/* Pestañas */}
      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenido de las pestañas */}
      <div className={styles.tabContent}>
        {activeTab === 'firma-empresa' && (
          <>
            {/* Sección de carga de documento */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h2 className={styles.cardTitle}>Documento a Firmar</h2>
                  <p className={styles.cardSubtitle}>
                    Carga el documento PDF o imagen donde se aplicará la firma
                  </p>
                </div>
              </div>

              <div className={styles.documentoSection}>
                {documentoPreview ? (
                  <div className={styles.documentoPreview}>
                    {documentoConFirma && documentoConFirma.url && !documentoConFirma.isPdf ? (
                      <div>
                        <div className={styles.documentoConFirma}>
                          <p className={styles.documentoConFirmaLabel}>
                            ✓ Documento con firma aplicada:
                          </p>
                        </div>
                        <img
                          src={documentoConFirma.url}
                          alt="Documento con firma"
                          className={styles.documentoImage}
                          onLoad={() => {
                            console.log('Documento con firma cargado correctamente')
                          }}
                          onError={(e) => {
                            console.error('Error al cargar el documento con firma:', e)
                            // Si falla, intentar mostrar el documento original
                            if (documentoCargado) {
                              setDocumentoConFirma(null)
                            }
                          }}
                        />
                      </div>
                    ) : documentoCargado?.type === 'application/pdf' ? (
                      <div 
                        className={styles.pdfContainer}
                        ref={setPdfContainerRef}
                      >
                        <iframe
                          src={documentoPreview}
                          className={styles.documentoIframe}
                          title="Documento PDF"
                        />
                        {/* Mostrar firma sobre el PDF si está configurada */}
                        {(documentoConFirma?.firmaPreview || firmaEmpresa.preview) && (documentoConFirma?.firmaPosition || firmaEmpresa.posicion) && (
                          <div className={styles.firmaOverlayPreview}>
                            <div className={styles.firmaOverlayLabel}>
                              <span>✓</span>
                              <span>Firma posicionada</span>
                            </div>
                            <div
                              className={styles.firmaOverlayImage}
                              style={{
                                position: 'absolute',
                                left: `${((documentoConFirma?.firmaPosition?.x ?? firmaEmpresa.posicion?.x) || 0) * pdfScale.scaleX}px`,
                                top: `${((documentoConFirma?.firmaPosition?.y ?? firmaEmpresa.posicion?.y) || 0) * pdfScale.scaleY}px`,
                                width: `${((documentoConFirma?.firmaSize?.width ?? firmaEmpresa.size?.width) || 200) * pdfScale.scaleX}px`,
                                height: `${((documentoConFirma?.firmaSize?.height ?? firmaEmpresa.size?.height) || 100) * pdfScale.scaleY}px`,
                              }}
                            >
                              <img
                                src={documentoConFirma?.firmaPreview || firmaEmpresa.preview}
                                alt="Firma"
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'contain',
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className={styles.imageContainer}>
                        <img
                          src={documentoPreview}
                          alt="Documento"
                          className={styles.documentoImage}
                          onError={(e) => {
                            console.error('Error al cargar el documento:', e)
                          }}
                        />
                        {/* Mostrar firma sobre imagen si está configurada */}
                        {firmaEmpresa.preview && firmaEmpresa.posicion && (
                          <div
                            className={styles.firmaOverlayImage}
                            style={{
                              position: 'absolute',
                              left: `${firmaEmpresa.posicion.x}px`,
                              top: `${firmaEmpresa.posicion.y}px`,
                              width: `${firmaEmpresa.size.width}px`,
                              height: `${firmaEmpresa.size.height}px`,
                            }}
                          >
                            <img
                              src={firmaEmpresa.preview}
                              alt="Firma"
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                              }}
                            />
                          </div>
                        )}
                      </div>
                    )}
                    <div className={styles.documentoInfo}>
                      <p className={styles.documentoName}>
                        {documentoConFirma && !documentoConFirma.isPdf 
                          ? `Documento con firma: ${documentoCargado?.name || 'Documento'}` 
                          : documentoConFirma && documentoConFirma.isPdf && documentoConFirma.firmaPreview
                          ? `Documento PDF con firma configurada: ${documentoCargado?.name || 'Documento'}`
                          : documentoCargado?.name || 'Documento'}
                      </p>
                      <button
                        onClick={() => {
                          setDocumentoCargado(null)
                          setDocumentoPreview(null)
                          setDocumentoConFirma(null)
                          if (documentoPreview?.startsWith('blob:')) {
                            URL.revokeObjectURL(documentoPreview)
                          }
                          if (documentoConFirma?.url?.startsWith('blob:')) {
                            URL.revokeObjectURL(documentoConFirma.url)
                          }
                        }}
                        className={styles.removeButton}
                      >
                        <X size={16} />
                        Eliminar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={styles.documentoPlaceholder}>
                    <Upload size={48} className={styles.uploadIcon} />
                    <p className={styles.uploadText}>
                      Arrastra un documento aquí o haz clic para seleccionar
                    </p>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,image/*"
                      onChange={handleDocumentoChange}
                      className={styles.fileInput}
                      id="documento-upload"
                    />
                    <label htmlFor="documento-upload" className={styles.uploadLabel}>
                      Seleccionar documento
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Sección de carga de firma */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h2 className={styles.cardTitle}>Firma y Sello de la Empresa</h2>
                  <p className={styles.cardSubtitle}>
                    Configura las imágenes de firma y sello que se aplicarán automáticamente a los documentos SENATI
                  </p>
                </div>
              </div>

              <div className={styles.firmaSection}>
                <div className={styles.firmaPreview}>
                  {firmaEmpresa.preview ? (
                    <img
                      src={firmaEmpresa.preview}
                      alt="Firma y sello"
                      className={styles.firmaImage}
                    />
                  ) : (
                    <div className={styles.firmaPlaceholder}>
                      <Upload size={48} className={styles.uploadIcon} />
                      <p className={styles.uploadText}>
                        Arrastra una imagen aquí o haz clic para seleccionar
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className={styles.fileInput}
                        id="firma-upload"
                      />
                      <label htmlFor="firma-upload" className={styles.uploadLabel}>
                        Seleccionar archivo
                      </label>
                    </div>
                  )}
                </div>

                <div className={styles.firmaActions}>
                  <Button
                    variant="primary"
                    icon={Save}
                    onClick={handleSaveFirma}
                    className={styles.actionButton}
                  >
                    Guardar Cambios
                  </Button>
                  <Button
                    variant="danger"
                    icon={Trash2}
                    onClick={handleDeleteFirma}
                    className={styles.actionButton}
                    disabled={!firmaEmpresa.imagen}
                  >
                    Eliminar
                  </Button>
                  <Button
                    variant="success"
                    icon={Edit}
                    onClick={handleEditFirma}
                    className={styles.actionButton}
                    disabled={!documentoCargado}
                  >
                    Editar Firma
                  </Button>
                </div>
              </div>
            </div>

            {/* Sección de carga de sello */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h2 className={styles.cardTitle}>Sello de la Empresa</h2>
                  <p className={styles.cardSubtitle}>
                    Sello oficial que se aplicará junto con la firma en los documentos
                  </p>
                </div>
              </div>

              <div className={styles.firmaSection}>
                <div className={styles.firmaPreview}>
                  {selloEmpresa.preview ? (
                    <img
                      src={selloEmpresa.preview}
                      alt="Sello de la empresa"
                      className={styles.firmaImage}
                    />
                  ) : (
                    <div className={styles.firmaPlaceholder}>
                      <Upload size={48} className={styles.uploadIcon} />
                      <p className={styles.uploadText}>
                        Arrastra una imagen aquí o haz clic para seleccionar
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleSelloChange}
                        className={styles.fileInput}
                        id="sello-upload"
                      />
                      <label htmlFor="sello-upload" className={styles.uploadLabel}>
                        Seleccionar archivo
                      </label>
                    </div>
                  )}
                </div>

                <div className={styles.firmaActions}>
                  <Button
                    variant="primary"
                    icon={Save}
                    onClick={handleSaveSello}
                    className={styles.actionButton}
                  >
                    Guardar Cambios
                  </Button>
                  <Button
                    variant="danger"
                    icon={Trash2}
                    onClick={handleDeleteSello}
                    className={styles.actionButton}
                    disabled={!selloEmpresa.imagen}
                  >
                    Eliminar
                  </Button>
                  <Button
                    variant="success"
                    icon={Edit}
                    onClick={handleEditSello}
                    className={styles.actionButton}
                    disabled={!documentoCargado}
                  >
                    Editar sello
                  </Button>
                </div>
              </div>
            </div>

            {/* Sección de posición de firma */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h2 className={styles.cardTitle}>Posición de Firma en Documentos</h2>
                  <p className={styles.cardSubtitle}>
                    Posiciones predeterminadas (se pueden ajustar manualmente en el Editor para cada documento)
                  </p>
                </div>
                <div className={styles.infoIconSmall}>
                  <Info size={20} />
                </div>
              </div>

              <div className={styles.posicionesSection}>
                {/* Convenio Tripartito */}
                <div className={styles.posicionCard}>
                  <label className={styles.posicionLabel}>Convenio Tripartito</label>
                  <div className={styles.posicionInputs}>
                    <Input
                      label="Pagina"
                      value={posicionesFirma.convenioTripartito.pagina}
                      onChange={(e) =>
                        handlePosicionChange('convenioTripartito', 'pagina', e.target.value)
                      }
                      placeholder="Ultima"
                      className={styles.posicionInput}
                    />
                    <Input
                      label="Posicion X"
                      value={posicionesFirma.convenioTripartito.posicionX}
                      onChange={(e) =>
                        handlePosicionChange('convenioTripartito', 'posicionX', e.target.value)
                      }
                      placeholder="Ultima"
                      className={styles.posicionInput}
                    />
                    <Input
                      label="Posicion Y"
                      value={posicionesFirma.convenioTripartito.posicionY}
                      onChange={(e) =>
                        handlePosicionChange('convenioTripartito', 'posicionY', e.target.value)
                      }
                      placeholder="Ultima"
                      className={styles.posicionInput}
                    />
                  </div>
                </div>

                {/* Constancia de Prácticas */}
                <div className={styles.posicionCard}>
                  <label className={styles.posicionLabel}>Constancia de Prácticas</label>
                  <div className={styles.posicionInputs}>
                    <Input
                      label="Pagina"
                      value={posicionesFirma.constanciaPracticas.pagina}
                      onChange={(e) =>
                        handlePosicionChange('constanciaPracticas', 'pagina', e.target.value)
                      }
                      placeholder="Ultima"
                      className={styles.posicionInput}
                    />
                    <Input
                      label="Posicion X"
                      value={posicionesFirma.constanciaPracticas.posicionX}
                      onChange={(e) =>
                        handlePosicionChange('constanciaPracticas', 'posicionX', e.target.value)
                      }
                      placeholder="Ultima"
                      className={styles.posicionInput}
                    />
                    <Input
                      label="Posicion Y"
                      value={posicionesFirma.constanciaPracticas.posicionY}
                      onChange={(e) =>
                        handlePosicionChange('constanciaPracticas', 'posicionY', e.target.value)
                      }
                      placeholder="Ultima"
                      className={styles.posicionInput}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.posicionesActions}>
                <Button
                  variant="success"
                  icon={Save}
                  onClick={handleSavePosiciones}
                  size="lg"
                >
                  Guardar Cambios
                </Button>
              </div>
            </div>
          </>
        )}

        {activeTab === 'compromisos' && (
          <Compromiso />
        )}

        {activeTab === 'constancia' && (
          <Constacia />
        )}

        {activeTab === 'firma-estudiante' && (
          <FirmaEstudiante />
        )}

        {activeTab === 'correos' && (
          <Correo />
        )}
      </div>

      {/* Modal Editor de Firma */}
      <EditorFirmaModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveFirmaEditada}
        firmaActual={firmaEmpresa}
        documentoActual={documentoCargado}
        documentoPreview={documentoPreview}
      />

      {/* Modal Editor de Sello */}
      <EditorFirmaModal
        isOpen={isEditorSelloOpen}
        onClose={() => setIsEditorSelloOpen(false)}
        onSave={handleSaveSelloEditado}
        firmaActual={selloEmpresa}
        documentoActual={documentoCargado}
        documentoPreview={documentoPreview}
      />
    </div>
  )
}

