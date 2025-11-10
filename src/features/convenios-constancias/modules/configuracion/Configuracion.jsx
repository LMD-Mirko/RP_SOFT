import { useState } from 'react'
import { AlertCircle, Upload, Trash2, Edit, Save, Info, X } from 'lucide-react'
import { Input } from '@shared/components/Input'
import { Button } from '@shared/components/Button'
import { useToast } from '@shared/components/Toast'
import { EditorFirmaModal } from './components/EditorFirmaModal'
import Compromiso from './pages/Compromiso'
import Constacia from './pages/Constacia'
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
  const [activeTab, setActiveTab] = useState('firma-empresa')
  const [isEditorOpen, setIsEditorOpen] = useState(false)
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

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFirmaEmpresa({
          ...firmaEmpresa,
          imagen: file,
          preview: reader.result,
        })
      }
      reader.readAsDataURL(file)
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


  const handleDeleteFirma = () => {
    setFirmaEmpresa({ 
      imagen: null, 
      preview: null,
      posicion: { x: 0, y: 0 },
      size: { width: 200, height: 100 },
    })
    toast.success('Firma eliminada correctamente')
  }

  const handleSelloChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelloEmpresa({
          ...selloEmpresa,
          imagen: file,
          preview: reader.result,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDeleteSello = () => {
    setSelloEmpresa({ 
      imagen: null, 
      preview: null,
      posicion: { x: 0, y: 0 },
      size: { width: 200, height: 200 },
    })
    toast.success('Sello eliminado correctamente')
  }

  const handleSaveSello = () => {
    // Aquí iría la lógica para guardar el sello
    toast.success('Sello guardado correctamente')
  }

  const handleEditSello = () => {
    // Abrir modal para editar sello (similar a la firma)
    toast.info('Funcionalidad de edición de sello en desarrollo')
  }

  const handleSaveFirma = () => {
    // Aquí iría la lógica para guardar la firma
    toast.success('Firma guardada correctamente')
  }

  const handleEditFirma = () => {
    setIsEditorOpen(true)
  }

  const handleSaveFirmaEditada = (data) => {
    // Guardar la firma con su posición en el documento
    setFirmaEmpresa((prev) => ({
      ...prev,
      imagen: data.firma,
      preview: data.firmaPreview,
      posicion: data.posicion,
      size: data.size || { width: 200, height: 100 },
    }))
    
    // Guardar el documento con la firma aplicada
    if (data.documentoConFirma) {
      // Si es PDF, mantener el documento original pero guardar la info de la firma
      if (data.documentoConFirma.isPdf) {
        setDocumentoConFirma(null)
        // Mantener el documento original visible
        toast.success('Firma posicionada correctamente. Para PDFs, la firma se aplicará al generar el documento final.')
      } else if (data.documentoConFirma.url && data.documentoConFirma.blob) {
        // Si hay una URL válida y un blob, mostrar el documento con la firma
        // Primero revocar la URL anterior si existe
        if (documentoPreview?.startsWith('blob:') && documentoPreview !== data.documentoConFirma.url) {
          URL.revokeObjectURL(documentoPreview)
        }
        
        setDocumentoConFirma(data.documentoConFirma)
        // Actualizar el preview para mostrar el documento con la firma
        setDocumentoPreview(data.documentoConFirma.url)
        toast.success('Firma posicionada y documento guardado correctamente')
      } else {
        // Si no hay URL válida, mantener el documento original
        setDocumentoConFirma(null)
        toast.success('Firma posicionada correctamente en el documento')
      }
    } else {
      toast.success('Firma posicionada correctamente en el documento')
    }
  }

  const handlePosicionChange = (documento, campo, valor) => {
    setPosicionesFirma((prev) => ({
      ...prev,
      [documento]: {
        ...prev[documento],
        [campo]: valor,
      },
    }))
  }

  const handleSavePosiciones = () => {
    // Aquí iría la lógica para guardar las posiciones
    toast.success('Posiciones guardadas correctamente')
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
                      <iframe
                        src={documentoPreview}
                        className={styles.documentoIframe}
                        title="Documento PDF"
                      />
                    ) : (
                      <img
                        src={documentoPreview}
                        alt="Documento"
                        className={styles.documentoImage}
                        onError={(e) => {
                          console.error('Error al cargar el documento:', e)
                        }}
                      />
                    )}
                    <div className={styles.documentoInfo}>
                      <p className={styles.documentoName}>
                        {documentoConFirma && !documentoConFirma.isPdf 
                          ? `Documento con firma: ${documentoCargado?.name || 'Documento'}` 
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
          <div className={styles.card}>
            <p className={styles.placeholderText}>Contenido de Firma Estudiante (en desarrollo)</p>
          </div>
        )}

        {activeTab === 'correos' && (
          <div className={styles.card}>
            <p className={styles.placeholderText}>Contenido de Correos (en desarrollo)</p>
          </div>
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
    </div>
  )
}
