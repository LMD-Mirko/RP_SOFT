import React, { useState, useRef } from 'react'
import { FileSpreadsheet, QrCode } from 'lucide-react'
import { QRGeneratorModal } from '@shared/components/ChatPanel/QRGeneratorModal/QRGeneratorModal'
import styles from './HerramientasPage.module.css'

export function HerramientasPage() {
  const [showQRModal, setShowQRModal] = useState(false)
  const xlsxInputRef = useRef(null)

  const handleXlsxUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Aquí puedes agregar la lógica para procesar el archivo XLSX
    console.log(`Archivo Excel seleccionado: ${file.name}`)

    if (xlsxInputRef.current) {
      xlsxInputRef.current.value = ''
    }
  }

  const handleOpenQRGenerator = () => {
    setShowQRModal(true)
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Herramientas</h1>
      <div className={styles.toolsGrid}>
        <div
          onClick={() => xlsxInputRef.current?.click()}
          className={styles.toolCard}
        >
          <FileSpreadsheet size={40} className={styles.toolIcon} />
          <span className={styles.toolLabel}>Subir archivo XLSX</span>
        </div>

        <div
          onClick={handleOpenQRGenerator}
          className={styles.toolCard}
        >
          <QrCode size={40} className={styles.toolIcon} />
          <span className={styles.toolLabel}>Generar QR</span>
        </div>
      </div>

      <input
        ref={xlsxInputRef}
        type="file"
        accept=".xlsx,.xls"
        style={{ display: 'none' }}
        onChange={handleXlsxUpload}
      />

      <QRGeneratorModal 
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
      />
    </div>
  )
}