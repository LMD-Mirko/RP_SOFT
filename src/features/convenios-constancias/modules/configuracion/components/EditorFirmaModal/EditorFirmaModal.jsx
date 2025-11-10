import { useState, useRef, useCallback, useEffect } from 'react'
import { Upload, X, Save, Move, ZoomIn, ZoomOut, Maximize2, Minimize2 } from 'lucide-react'
import { Modal } from '@shared/components/Modal'
import { Button } from '@shared/components/Button'
import { useToast } from '@shared/components/Toast'
import styles from './EditorFirmaModal.module.css'

export function EditorFirmaModal({ isOpen, onClose, onSave, firmaActual, documentoActual, documentoPreview }) {
  const toast = useToast()
  const [firma, setFirma] = useState(null)
  const [firmaPreview, setFirmaPreview] = useState(null)
  const [firmaPosition, setFirmaPosition] = useState({ x: 50, y: 50 })
  const [firmaSize, setFirmaSize] = useState({ width: 200, height: 100 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const containerRef = useRef(null)
  const firmaRef = useRef(null)
  const canvasRef = useRef(null)
  
  // El documento está disponible si se pasa como prop
  const documentoDisponible = documentoActual && documentoPreview

  // Cargar firma actual si existe
  useEffect(() => {
    if (isOpen) {
      if (firmaActual?.preview) {
        setFirmaPreview(firmaActual.preview)
        setFirma(firmaActual.imagen)
      } else {
        // Si no hay firma cargada, limpiar el estado
        setFirmaPreview(null)
        setFirma(null)
      }
      if (firmaActual?.posicion) {
        setFirmaPosition(firmaActual.posicion)
      } else {
        setFirmaPosition({ x: 50, y: 50 })
      }
      if (firmaActual?.size) {
        setFirmaSize(firmaActual.size)
      } else {
        setFirmaSize({ width: 200, height: 100 })
      }
    }
  }, [isOpen, firmaActual])


  const handleFirmaChange = (e) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setFirma(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setFirmaPreview(reader.result)
        // Posicionar la firma en el centro del documento por defecto
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect()
          const centerX = (rect.width / zoom - firmaSize.width) / 2
          const centerY = (rect.height / zoom - firmaSize.height) / 2
          setFirmaPosition({ 
            x: Math.max(0, centerX), 
            y: Math.max(0, centerY) 
          })
        }
        toast.success('Firma cargada correctamente')
      }
      reader.readAsDataURL(file)
    } else {
      toast.error('Por favor selecciona una imagen para la firma')
    }
  }

  const handleMouseDown = useCallback((e) => {
    if (!firmaPreview || !containerRef.current) return
    e.preventDefault()
    setIsDragging(true)
    const rect = containerRef.current.getBoundingClientRect()
    const scaledX = firmaPosition.x * zoom
    const scaledY = firmaPosition.y * zoom
    setDragStart({
      x: e.clientX - rect.left - scaledX,
      y: e.clientY - rect.top - scaledY,
    })
  }, [firmaPreview, firmaPosition, zoom])

  const handleMouseMove = useCallback((e) => {
    if (!isDragging || !containerRef.current) return
    e.preventDefault()
    const rect = containerRef.current.getBoundingClientRect()
    const newX = (e.clientX - rect.left - dragStart.x) / zoom
    const newY = (e.clientY - rect.top - dragStart.y) / zoom
    
    // Obtener dimensiones del documento
    const docWidth = rect.width / zoom
    const docHeight = rect.height / zoom
    
    // Limitar dentro del contenedor (asumiendo firma de ~150x80px)
    const firmaWidth = 150
    const firmaHeight = 80
    const maxX = docWidth - firmaWidth
    const maxY = docHeight - firmaHeight
    
    setFirmaPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY)),
    })
  }, [isDragging, dragStart, zoom])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 2))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5))
  }

  const handleFirmaSizeChange = (delta) => {
    setFirmaSize((prev) => ({
      width: Math.max(50, Math.min(500, prev.width + delta)),
      height: Math.max(25, Math.min(250, prev.height + delta * 0.5)),
    }))
  }

  const combineDocumentWithSignature = async () => {
    return new Promise((resolve, reject) => {
      try {
        // Si el documento es un PDF, no podemos combinarlo directamente con canvas
        // En ese caso, retornamos solo la información de posición
        if (documentoActual?.type === 'application/pdf') {
          // Para PDFs, guardamos la información pero no podemos generar la imagen combinada
          // El usuario verá el documento original con la firma posicionada
          resolve({
            blob: null,
            url: documentoPreview,
            isPdf: true,
          })
          return
        }

        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        if (!ctx) {
          reject(new Error('No se pudo obtener el contexto del canvas'))
          return
        }
        
        const docImg = new Image()
        
        // No usar crossOrigin para blob URLs o data URLs
        if (!documentoPreview.startsWith('blob:') && !documentoPreview.startsWith('data:')) {
          docImg.crossOrigin = 'anonymous'
        }
        
        docImg.onload = () => {
          try {
            canvas.width = docImg.width
            canvas.height = docImg.height
            
            // Dibujar el documento
            ctx.drawImage(docImg, 0, 0)
            
            // Si hay firma, dibujarla sobre el documento
            if (firmaPreview) {
              const firmaImg = new Image()
              
              // No usar crossOrigin para blob URLs o data URLs
              if (!firmaPreview.startsWith('blob:') && !firmaPreview.startsWith('data:')) {
                firmaImg.crossOrigin = 'anonymous'
              }
              
              firmaImg.onload = () => {
                try {
                  // Calcular posición y tamaño escalados
                  // Asumimos que el documento en el editor tiene un tamaño de visualización
                  // y necesitamos escalar las coordenadas al tamaño real de la imagen
                  const displayWidth = documentoActual?.type === 'application/pdf' ? 800 : docImg.width
                  const displayHeight = documentoActual?.type === 'application/pdf' ? 1000 : docImg.height
                  
                  const scaleX = docImg.width / displayWidth
                  const scaleY = docImg.height / displayHeight
                  
                  const scaledX = firmaPosition.x * scaleX
                  const scaledY = firmaPosition.y * scaleY
                  const scaledWidth = firmaSize.width * scaleX
                  const scaledHeight = firmaSize.height * scaleY
                  
                  ctx.drawImage(firmaImg, scaledX, scaledY, scaledWidth, scaledHeight)
                  
                  // Pequeño delay para asegurar que el canvas esté listo
                  setTimeout(() => {
                    canvas.toBlob(
                      (blob) => {
                        if (blob) {
                          const url = URL.createObjectURL(blob)
                          console.log('Documento con firma generado correctamente:', { 
                            blobSize: blob.size, 
                            url: url.substring(0, 50) + '...' 
                          })
                          resolve({ blob, url, isPdf: false })
                        } else {
                          reject(new Error('No se pudo generar el blob de la imagen'))
                        }
                      },
                      'image/png',
                      1.0
                    )
                  }, 100)
                } catch (error) {
                  console.error('Error al dibujar la firma:', error)
                  reject(error)
                }
              }
              
              firmaImg.onerror = (error) => {
                console.error('Error al cargar la imagen de la firma:', error)
                reject(new Error('Error al cargar la imagen de la firma'))
              }
              
              firmaImg.src = firmaPreview
            } else {
              // Solo el documento sin firma
              canvas.toBlob(
                (blob) => {
                  if (blob) {
                    const url = URL.createObjectURL(blob)
                    resolve({ blob, url, isPdf: false })
                  } else {
                    reject(new Error('No se pudo generar el blob de la imagen'))
                  }
                },
                'image/png',
                1.0
              )
            }
          } catch (error) {
            console.error('Error al procesar el documento:', error)
            reject(error)
          }
        }
        
        docImg.onerror = (error) => {
          console.error('Error al cargar el documento:', error)
          reject(new Error('Error al cargar el documento'))
        }
        
        docImg.src = documentoPreview
      } catch (error) {
        console.error('Error en combineDocumentWithSignature:', error)
        reject(error)
      }
    })
  }

  const handleSave = async () => {
    if (!firma) {
      toast.warning('Por favor carga una firma')
      return
    }

    if (!documentoActual || !documentoPreview) {
      toast.warning('Por favor carga un documento primero')
      return
    }

    try {
      // Combinar documento con firma
      const result = await combineDocumentWithSignature()
      
      const data = {
        firma,
        firmaPreview,
        posicion: firmaPosition,
        size: firmaSize,
        zoom,
        documentoConFirma: {
          blob: result.blob,
          url: result.url,
          nombre: documentoActual.name,
          isPdf: result.isPdf || false,
        },
      }

      onSave(data)
      if (result.isPdf) {
        toast.success('Firma posicionada correctamente. Para PDFs, la firma se aplicará al generar el documento final.')
      } else {
        toast.success('Firma posicionada y guardada correctamente')
      }
      onClose()
    } catch (error) {
      console.error('Error al combinar documento con firma:', error)
      toast.error(`Error al guardar el documento con la firma: ${error.message || 'Error desconocido'}`)
    }
  }

  const handleReset = () => {
    setFirma(null)
    setFirmaPreview(null)
    setFirmaPosition({ x: 50, y: 50 })
    setZoom(1)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editor de Firma"
      size="full"
      closeOnOverlayClick={false}
    >
      <div className={styles.container}>
        {/* Panel de controles superior */}
        <div className={styles.controls}>
          {documentoActual && (
            <div className={styles.controlGroup}>
              <span className={styles.documentoInfo}>
                Documento: {documentoActual.name}
              </span>
            </div>
          )}

          <div className={styles.controlGroup}>
            {!firmaPreview ? (
              <label className={styles.controlLabel}>
                <Upload size={18} />
                Cargar Firma
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFirmaChange}
                  className={styles.fileInput}
                />
              </label>
            ) : (
              <div className={styles.firmaLoaded}>
                <span className={styles.fileName}>{firma?.name || 'Firma cargada'}</span>
                <button
                  onClick={() => {
                    setFirma(null)
                    setFirmaPreview(null)
                    setFirmaPosition({ x: 50, y: 50 })
                  }}
                  className={styles.removeFirmaButton}
                  title="Eliminar firma"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          <div className={styles.zoomControls}>
            <button
              onClick={handleZoomOut}
              className={styles.zoomButton}
              disabled={zoom <= 0.5}
            >
              <ZoomOut size={18} />
            </button>
            <span className={styles.zoomValue}>{Math.round(zoom * 100)}%</span>
            <button
              onClick={handleZoomIn}
              className={styles.zoomButton}
              disabled={zoom >= 2}
            >
              <ZoomIn size={18} />
            </button>
          </div>

          {firmaPreview && (
            <div className={styles.sizeControls}>
              <span className={styles.sizeLabel}>Tamaño Firma:</span>
              <button
                onClick={() => handleFirmaSizeChange(-10)}
                className={styles.sizeButton}
                disabled={firmaSize.width <= 50}
              >
                <Minimize2 size={16} />
              </button>
              <span className={styles.sizeValue}>
                {Math.round(firmaSize.width)}x{Math.round(firmaSize.height)}px
              </span>
              <button
                onClick={() => handleFirmaSizeChange(10)}
                className={styles.sizeButton}
                disabled={firmaSize.width >= 500}
              >
                <Maximize2 size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Área de edición */}
        <div className={styles.editorArea}>
          {documentoDisponible ? (
            <div
              ref={containerRef}
              className={styles.documentContainer}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
            >
              {documentoActual?.type === 'application/pdf' ? (
                <iframe
                  src={`${documentoPreview}#toolbar=0&navpanes=0&scrollbar=1`}
                  className={styles.pdfViewer}
                  title="Documento PDF"
                />
              ) : documentoPreview ? (
                <img
                  src={documentoPreview}
                  alt="Documento"
                  className={styles.documentImage}
                />
              ) : (
                <div className={styles.pdfDocument}>
                  <div className={styles.pdfContent}>
                    <div className={styles.pdfHeader}>
                      <h3>Documento PDF</h3>
                      <p>No hay documento cargado</p>
                    </div>
                    <div className={styles.pdfBody}>
                      <p>Por favor carga un documento para firmar.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Firma posicionable */}
              {firmaPreview && documentoDisponible && (
                <div
                  ref={firmaRef}
                  className={`${styles.firmaOverlay} ${isDragging ? styles.dragging : ''}`}
                  style={{
                    left: `${firmaPosition.x}px`,
                    top: `${firmaPosition.y}px`,
                  }}
                  onMouseDown={handleMouseDown}
                >
                  <img
                    src={firmaPreview}
                    alt="Firma"
                    className={styles.firmaImage}
                    style={{
                      width: `${firmaSize.width}px`,
                      height: `${firmaSize.height}px`,
                    }}
                    onLoad={() => {
                      // Asegurar que la firma sea visible
                      if (firmaRef.current) {
                        firmaRef.current.style.display = 'block'
                      }
                    }}
                    onError={(e) => {
                      console.error('Error cargando imagen de firma:', e)
                      toast.error('Error al cargar la imagen de la firma')
                    }}
                  />
                  <div className={styles.firmaHandle}>
                    <Move size={16} />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <Upload size={64} className={styles.emptyIcon} />
              <p className={styles.emptyText}>
                No hay documento disponible
              </p>
            </div>
          )}
        </div>

        {/* Panel de información de posición */}
        {firmaPreview && (
          <div className={styles.positionInfo}>
            <div className={styles.positionItem}>
              <span className={styles.positionLabel}>Posición X:</span>
              <span className={styles.positionValue}>{Math.round(firmaPosition.x)}px</span>
            </div>
            <div className={styles.positionItem}>
              <span className={styles.positionLabel}>Posición Y:</span>
              <span className={styles.positionValue}>{Math.round(firmaPosition.y)}px</span>
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className={styles.footer}>
          <Button variant="secondary" onClick={handleReset}>
            Limpiar
          </Button>
          <div className={styles.footerRight}>
            <Button variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button variant="primary" icon={Save} onClick={handleSave}>
              Guardar Firma
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

