/**
 * Servicio para generar PDFs de postulantes
 */

import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

// Aplicar el plugin para que autoTable funcione correctamente
// En versiones 5.0.0+, el plugin puede necesitar aplicarse manualmente
if (autoTable && typeof autoTable === 'function' && autoTable.applyPlugin) {
  autoTable.applyPlugin(jsPDF)
}

/**
 * Genera un PDF con la información completa de un postulante
 * @param {Object} postulante - Datos del postulante
 * @returns {Promise<void>}
 */
export const generatePostulantePDF = async (postulante) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  // Paleta de colores moderna y profesional
  const primaryDark = [15, 23, 42] // Slate 900
  const primaryColor = [30, 58, 138] // Azul oscuro moderno
  const accentColor = [59, 130, 246] // Azul brillante
  const successColor = [16, 185, 129] // Verde éxito
  const warningColor = [245, 158, 11] // Amarillo
  const lightGray = [248, 250, 252] // Slate 50
  const borderGray = [226, 232, 240] // Slate 200
  const textColor = [15, 23, 42] // Texto oscuro
  const textSecondary = [100, 116, 139] // Texto secundario
  const white = [255, 255, 255]

  // Configuración de fuente
  doc.setFont('helvetica')

  // ===== HEADER MODERNO =====
  // Fondo negro elegante
  doc.setFillColor(...primaryDark)
  doc.rect(0, 0, 210, 28, 'F')
  
  // Línea decorativa superior
  doc.setFillColor(...accentColor)
  doc.rect(0, 0, 210, 2.5, 'F')
  
  // Título principal
  doc.setTextColor(...white)
  doc.setFontSize(21)
  doc.setFont('helvetica', 'bold')
  doc.text('Información del Postulante', 105, 14, { align: 'center' })
  
  // Subtítulo con fecha
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(180, 180, 180)
  const fechaGen = new Date().toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
  doc.text(`Generado el ${fechaGen}`, 105, 21, { align: 'center' })

  let yPosition = 36

  // ===== SECCIÓN: INFORMACIÓN PERSONAL =====
  // Fondo de sección con borde izquierdo de color
  doc.setFillColor(...lightGray)
  doc.roundedRect(10, yPosition - 5, 190, 7, 2, 2, 'F')
  doc.setFillColor(...accentColor)
  doc.rect(10, yPosition - 5, 3, 7, 'F')
  
  doc.setTextColor(...textColor)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Información Personal', 16, yPosition)
  
  yPosition += 7

  // Tabla de información personal moderna
  const personalData = [
    ['Nombre Completo', postulante.nombre || 'No especificado'],
    ['Correo Electrónico', postulante.correo || 'No especificado'],
    ['Usuario', postulante.username ? `@${postulante.username}` : 'No especificado'],
    ['Documento', `${postulante.documentType || 'Documento'}: ${postulante.dni || 'No especificado'}`],
    ['Teléfono', postulante.telefono || 'No especificado'],
    ['Sexo', postulante.sex === 'M' ? 'Masculino' : postulante.sex === 'F' ? 'Femenino' : postulante.sex || 'No especificado'],
  ]

  if (postulante.fechaNacimiento) {
    const birthDate = new Date(postulante.fechaNacimiento)
    const age = calculateAge(birthDate)
    const formattedDate = birthDate.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
    personalData.push(['Fecha de Nacimiento', `${formattedDate} (${age} años)`])
  }

  autoTable(doc, {
    startY: yPosition,
    head: false,
    body: personalData,
    theme: 'striped',
    styles: {
      fontSize: 9,
      cellPadding: { top: 5, bottom: 5, left: 8, right: 8 },
      textColor: textColor,
      lineColor: borderGray,
      lineWidth: 0.3,
      font: 'helvetica',
      valign: 'middle',
    },
    columnStyles: {
      0: { 
        fontStyle: 'bold', 
        cellWidth: 60, 
        fillColor: [248, 250, 252], 
        textColor: textSecondary,
        fontSize: 9,
        halign: 'left'
      },
      1: { 
        cellWidth: 'auto', 
        textColor: textColor,
        fontSize: 9,
        halign: 'left',
        fillColor: white
      }
    },
    margin: { left: 15, right: 15, top: 2, bottom: 2 },
    tableWidth: 'wrap',
    alternateRowStyles: {
      fillColor: [252, 252, 253]
    },
    headStyles: {
      fillColor: [241, 245, 249],
      textColor: textColor,
      fontStyle: 'bold'
    }
  })

  yPosition = doc.lastAutoTable.finalY + 5

  // ===== SECCIÓN: UBICACIÓN =====
  const ubicacion = [
    postulante.district,
    postulante.province,
    postulante.region,
    postulante.country
  ].filter(Boolean).join(', ') || postulante.direccion || 'No especificada'

  if (ubicacion !== 'No especificada') {
    // Fondo de sección
    doc.setFillColor(...lightGray)
    doc.roundedRect(10, yPosition - 5, 190, 7, 2, 2, 'F')
    doc.setFillColor(...successColor)
    doc.rect(10, yPosition - 5, 3, 7, 'F')
    
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Ubicación', 16, yPosition)
    
    yPosition += 7

    const locationData = [
      ['Dirección', postulante.direccion || 'No especificada'],
      ['Ubicación Completa', ubicacion]
    ]

    autoTable(doc, {
      startY: yPosition,
      head: false,
      body: locationData,
      theme: 'striped',
      styles: {
        fontSize: 9,
        cellPadding: { top: 5, bottom: 5, left: 8, right: 8 },
        textColor: textColor,
        lineColor: borderGray,
        lineWidth: 0.3,
        font: 'helvetica',
        valign: 'middle',
      },
      columnStyles: {
        0: { 
          fontStyle: 'bold', 
          cellWidth: 60, 
          fillColor: [248, 250, 252], 
          textColor: textSecondary,
          fontSize: 9,
          halign: 'left'
        },
        1: { 
          cellWidth: 'auto', 
          textColor: textColor,
          fontSize: 9,
          halign: 'left',
          fillColor: white
        }
      },
      margin: { left: 15, right: 15, top: 2, bottom: 2 },
      tableWidth: 'wrap',
      alternateRowStyles: {
        fillColor: [252, 252, 253]
      }
    })

    yPosition = doc.lastAutoTable.finalY + 5
  }

  // ===== SECCIONES EN PARALELO: INFORMACIÓN ACADÉMICA E INFORMACIÓN DEL PROCESO =====
  const startYParallel = yPosition
  let maxYPosition = yPosition

  // Preparar datos de Información Académica
  const academicData = []
  const hasAcademicData = postulante.specialty || postulante.career || postulante.semester || postulante.experienceLevel

  // Configuración de columnas balanceadas
  const leftColX = 10
  const leftColWidth = hasAcademicData ? 92 : 0
  const gap = hasAcademicData ? 6 : 0 // Espacio entre columnas
  const rightColX = hasAcademicData ? leftColX + leftColWidth + gap : leftColX
  const rightColWidth = hasAcademicData ? 92 : 190
  
  if (hasAcademicData) {
    if (postulante.specialty) {
      academicData.push(['Especialidad', typeof postulante.specialty === 'object' ? postulante.specialty.name : postulante.specialty])
    }
    if (postulante.career) {
      academicData.push(['Carrera', postulante.career])
    }
    if (postulante.semester) {
      academicData.push(['Semestre', postulante.semester])
    }
    if (postulante.experienceLevel) {
      const experienceMap = {
        'principiante': 'Principiante',
        'intermedio': 'Intermedio',
        'avanzado': 'Avanzado'
      }
      academicData.push(['Nivel de Experiencia', experienceMap[postulante.experienceLevel] || postulante.experienceLevel])
    }
  }

  // Preparar datos de Información del Proceso
  const estadoFinal = postulante.accepted === true ? 'Aceptado' : 
                      postulante.accepted === false ? 'Rechazado' : 
                      postulante.estado || 'Pendiente'
  
  let estadoColor = primaryColor
  if (estadoFinal === 'Aceptado') {
    estadoColor = successColor
  } else if (estadoFinal === 'Rechazado') {
    estadoColor = [239, 68, 68] // Rojo
  }

  const processData = [
    ['Etapa', postulante.etapa || 'No especificada'],
    ['Estado', estadoFinal],
    ['Fecha de Registro', formatDateShort(postulante.fecha)],
  ]

  if (postulante.lastUpdate) {
    processData.push(['Última Actualización', formatDateShort(postulante.lastUpdate)])
  }

  // Dibujar secciones en paralelo
  // COLUMNA IZQUIERDA: Información Académica
  if (hasAcademicData) {
    // Fondo de sección izquierda
    doc.setFillColor(...lightGray)
    doc.roundedRect(leftColX, startYParallel - 5, leftColWidth, 7, 2, 2, 'F')
    doc.setFillColor(...warningColor)
    doc.rect(leftColX, startYParallel - 5, 3, 7, 'F')
    
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...textColor)
    doc.text('Información Académica', leftColX + 6, startYParallel)
    
    const academicStartY = startYParallel + 7

    autoTable(doc, {
      startY: academicStartY,
      head: false,
      body: academicData,
      theme: 'striped',
      styles: {
        fontSize: 9,
        cellPadding: { top: 5, bottom: 5, left: 8, right: 8 },
        textColor: textColor,
        lineColor: borderGray,
        lineWidth: 0.3,
        font: 'helvetica',
        valign: 'middle',
      },
      columnStyles: {
        0: { 
          fontStyle: 'bold', 
          cellWidth: 38, 
          fillColor: [248, 250, 252], 
          textColor: textSecondary,
          fontSize: 9,
          halign: 'left'
        },
        1: { 
          cellWidth: 'auto', 
          textColor: textColor,
          fontSize: 9,
          halign: 'left',
          fillColor: white
        }
      },
      margin: { left: leftColX + 5, right: 5, top: 2, bottom: 2 },
      tableWidth: leftColWidth - 10,
      alternateRowStyles: {
        fillColor: [252, 252, 253]
      }
    })

    if (doc.lastAutoTable.finalY > maxYPosition) {
      maxYPosition = doc.lastAutoTable.finalY
    }
  }

  // COLUMNA DERECHA: Información del Proceso (siempre se muestra)
  // Fondo de sección derecha
  doc.setFillColor(...lightGray)
  doc.roundedRect(rightColX, startYParallel - 5, rightColWidth, 7, 2, 2, 'F')
  doc.setFillColor(...estadoColor)
  doc.rect(rightColX, startYParallel - 5, 3, 7, 'F')
  
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...textColor)
  doc.text('Información del Proceso', rightColX + 6, startYParallel)
  
  const processStartY = startYParallel + 7

  // Ajustar ancho de columna de etiquetas según el espacio disponible
  const labelWidth = hasAcademicData ? 38 : 60

  autoTable(doc, {
    startY: processStartY,
    head: false,
    body: processData,
    theme: 'striped',
    styles: {
      fontSize: 9,
      cellPadding: { top: 5, bottom: 5, left: 8, right: 8 },
      textColor: textColor,
      lineColor: borderGray,
      lineWidth: 0.3,
      font: 'helvetica',
      valign: 'middle',
    },
    columnStyles: {
      0: { 
        fontStyle: 'bold', 
        cellWidth: labelWidth, 
        fillColor: [248, 250, 252], 
        textColor: textSecondary,
        fontSize: 9,
        halign: 'left'
      },
      1: { 
        cellWidth: 'auto', 
        textColor: textColor,
        fontSize: 9,
        halign: 'left',
        fillColor: white
      }
    },
    margin: { left: rightColX + 5, right: 5, top: 2, bottom: 2 },
    tableWidth: rightColWidth - 10,
    alternateRowStyles: {
      fillColor: [252, 252, 253]
    }
  })

  if (doc.lastAutoTable.finalY > maxYPosition) {
    maxYPosition = doc.lastAutoTable.finalY
  }

  yPosition = maxYPosition + 5

  // ===== FOOTER ELEGANTE =====
  const pageHeight = doc.internal.pageSize.height
  
  // Línea decorativa superior del footer
  doc.setFillColor(...borderGray)
  doc.rect(0, pageHeight - 15, 210, 0.5, 'F')
  
  // Fondo del footer
  doc.setFillColor(...lightGray)
  doc.rect(0, pageHeight - 14.5, 210, 14.5, 'F')
  
  // Texto del footer
  doc.setTextColor(...textSecondary)
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.text('Sistema de Selección de Practicantes', 105, pageHeight - 8, { align: 'center' })
  
  // Fecha en footer
  doc.setFontSize(7)
  doc.setTextColor(150, 150, 150)
  doc.text(`Documento generado automáticamente • ${new Date().toLocaleDateString('es-ES')}`, 105, pageHeight - 4, { align: 'center' })

  // ===== DESCARGAR DIRECTAMENTE =====
  const fileName = `Postulante_${postulante.nombre?.replace(/\s+/g, '_') || 'Sin_Nombre'}_${new Date().toISOString().split('T')[0]}.pdf`
  doc.save(fileName)
}

/**
 * Calcula la edad a partir de una fecha de nacimiento
 * @param {Date} birthDate - Fecha de nacimiento
 * @returns {number} Edad
 */
const calculateAge = (birthDate) => {
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

/**
 * Formatea una fecha a formato corto y legible
 * @param {string} dateString - Fecha en formato ISO
 * @returns {string} Fecha formateada
 */
const formatDateShort = (dateString) => {
  if (!dateString) return 'No especificada'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

