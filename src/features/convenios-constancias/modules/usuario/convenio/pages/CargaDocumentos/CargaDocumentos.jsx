import { useMemo, useState, useEffect } from 'react'
import { Button, Modal } from 'antd'
import styles from './CargaDocumentos.module.css'
import { DocumentCard } from '../../components/DocumentCard'
import { useNavigate } from 'react-router-dom'

export function CargaDocumentos() {
  const navigate = useNavigate()
  const initialDocs = useMemo(
    () => ({
      convenio: { title: 'Convenio de Practicas', status: 'pending', fileName: null, meta: null },
      pea: { title: 'Documento PEA', status: 'pending', fileName: null, meta: null },
      carta: { title: 'Carta de Presentacion', status: 'pending', fileName: null, meta: null },
    }),
    []
  )

  const [docs, setDocs] = useState(initialDocs)
  const SELECT_SIZE_MB = 20 // Permite seleccionar hasta 20MB; se valida en envío

  // No persistimos selección previa; solo guardamos al enviar.
  // Esto evita que al refrescar se arrastren archivos anteriores.

  const handleUpload = (key, file) => {
    const isPdf = file.type?.includes('pdf') || file.name?.toLowerCase().endsWith('.pdf')
    const withinSelectLimit = file.size <= SELECT_SIZE_MB * 1024 * 1024

    // En selección: solo verificamos que sea PDF y, opcionalmente, hasta 20MB.
    // El límite real (10MB) se aplica en el envío.
    setDocs((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        status: isPdf && withinSelectLimit ? 'uploaded' : 'pending',
        fileName: isPdf && withinSelectLimit ? file.name : prev[key].fileName,
        meta: { size: file.size, type: file.type },
      },
    }))
  }

  const allUploaded = Object.values(docs).every((d) => d.status === 'uploaded')

  const handleSubmit = () => {
    // Validaciones al enviar: tamaño real y tipo de documento correcto
    const PROCESS_LIMIT_MB = 10
    const expectedDoc = {
      convenio: 'convenio',
      pea: 'pea',
      carta: 'carta',
    }

    const normalize = (s) => s?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') || ''

    const aggregatedErrors = []
    const results = Object.fromEntries(
      Object.entries(docs).map(([key, d]) => {
        const errors = []
        const nameNorm = normalize(d.fileName)
        const typeOk = d.meta?.type?.includes('pdf') || d.fileName?.toLowerCase().endsWith('.pdf')
        if (!d.fileName) errors.push('No se seleccionó archivo.')
        if (!typeOk) errors.push('El archivo no es PDF.')
        if (d.meta && d.meta.size > PROCESS_LIMIT_MB * 1024 * 1024)
          errors.push(`El archivo supera ${PROCESS_LIMIT_MB}MB para procesamiento.`)
        // Documento correcto por tarjeta
        const keyword = expectedDoc[key]
        if (d.fileName && !nameNorm.includes(keyword)) {
          const label = d.title
          errors.push(`Documento incorrecto. Se requiere: ${label}.`)
        }
        // Regla mock: si nombre incluye "pea" y "error" => error de contenido
        if (key === 'pea' && nameNorm.includes('error'))
          errors.push('El RUC de la empresa no coincide con nuestros registros.')

        if (errors.length) aggregatedErrors.push({ key, title: d.title, errors })
        return [key, { ...d, errors }]
      })
    )

    // Mostrar modal de errores si hay
    if (aggregatedErrors.length) {
      Modal.error({
        title: 'Se detectaron errores en la validación',
        width: 560,
        content: (
          <div>
            {aggregatedErrors.map((grp, idx) => (
              <div key={idx} style={{ marginBottom: 8 }}>
                <strong>{grp.title}:</strong>
                <ul style={{ marginTop: 4 }}>
                  {grp.errors.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ),
      })
    }

    localStorage.setItem('convenioDocs', JSON.stringify(results))
    localStorage.setItem('convenioStage', 'validation')
    navigate('/convenios-constancias/usuario/convenio/resultado-validacion')
  }

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Convenios de Prácticas</h1>
        <p className={styles.subtitle}>Carga los 3 documentos requeridos en formato PDF</p>
      </header>

      <div className={styles.grid}>
        <DocumentCard
          title={docs.convenio.title}
          fileName={docs.convenio.fileName}
          status={docs.convenio.status}
          onUpload={(file) => handleUpload('convenio', file)}
        />
        <DocumentCard
          title={docs.pea.title}
          fileName={docs.pea.fileName}
          status={docs.pea.status}
          onUpload={(file) => handleUpload('pea', file)}
        />
        <DocumentCard
          title={docs.carta.title}
          fileName={docs.carta.fileName}
          status={docs.carta.status}
          onUpload={(file) => handleUpload('carta', file)}
        />
      </div>

      <div className={styles.requirementsCard}>
        <div>
          <h3 className={styles.reqTitle}>Requisitos Importantes</h3>
          <ul className={styles.reqList}>
            <li>Formato: Solo archivos PDF</li>
            <li>Se aceptan únicamente: Convenio, Documento PEA y Carta de Presentación</li>
            <li>Selección permitida hasta 20 MB; límite de procesamiento: 10 MB</li>
            <li>Los documentos deben estar completos y legibles</li>
            <li>Asegúrate de que toda la información sea correcta</li>
          </ul>
        </div>
        <div className={styles.reqActions}>
          <Button type="default" size="large" disabled={!allUploaded} onClick={handleSubmit}>
            Enviar Documentos
          </Button>
        </div>
      </div>
    </section>
  )
}