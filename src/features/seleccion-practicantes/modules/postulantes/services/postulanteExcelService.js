/**
 * Servicio para generar archivos Excel de postulantes
 */

import ExcelJS from 'exceljs'

/**
 * Genera un archivo Excel con la información de los postulantes
 * @param {Array} postulantes - Array de postulantes a exportar
 * @param {string} filterType - Tipo de filtro aplicado ('all', 'accepted', 'rejected', 'pending')
 */
export const generatePostulantesExcel = async (postulantes, filterType = 'all') => {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Postulantes')

  // Definir colores pasteles para las cabeceras
  const headerColors = {
    fill: {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE8F4F8' } // Azul pastel
    },
    font: {
      bold: true,
      size: 12,
      color: { argb: 'FF1E3A5F' } // Azul oscuro
    },
    alignment: {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true
    },
    border: {
      top: { style: 'thin', color: { argb: 'FFB0C4DE' } },
      left: { style: 'thin', color: { argb: 'FFB0C4DE' } },
      bottom: { style: 'thin', color: { argb: 'FFB0C4DE' } },
      right: { style: 'thin', color: { argb: 'FFB0C4DE' } }
    }
  }

  // Definir estilos para las celdas de datos
  const dataStyle = {
    alignment: {
      vertical: 'middle',
      horizontal: 'left',
      wrapText: true
    },
    border: {
      top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
      left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
      bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
      right: { style: 'thin', color: { argb: 'FFE5E7EB' } }
    }
  }

  // Estilos alternados para filas
  const evenRowFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF9FAFB' } }
  const oddRowFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }

  // Definir columnas
  worksheet.columns = [
    { header: 'ID', key: 'id', width: 10 },
    { header: 'Nombre Completo', key: 'nombre', width: 30 },
    { header: 'Correo Electrónico', key: 'correo', width: 30 },
    { header: 'Documento', key: 'documentType', width: 15 },
    { header: 'Número de Documento', key: 'dni', width: 20 },
    { header: 'Teléfono', key: 'telefono', width: 15 },
    { header: 'Sexo', key: 'sex', width: 10 },
    { header: 'Fecha de Nacimiento', key: 'fechaNacimiento', width: 18 },
    { header: 'Dirección', key: 'direccion', width: 30 },
    { header: 'Región', key: 'region', width: 20 },
    { header: 'Provincia', key: 'province', width: 20 },
    { header: 'Distrito', key: 'district', width: 20 },
    { header: 'Especialidad', key: 'specialty', width: 25 },
    { header: 'Carrera', key: 'career', width: 25 },
    { header: 'Semestre', key: 'semester', width: 12 },
    { header: 'Nivel de Experiencia', key: 'experienceLevel', width: 20 },
    { header: 'Etapa', key: 'etapa', width: 20 },
    { header: 'Estado', key: 'estado', width: 15 },
    { header: 'Fecha de Registro', key: 'fecha', width: 18 }
  ]

  // Aplicar estilos a las cabeceras
  const headerRow = worksheet.getRow(1)
  headerRow.height = 30
  worksheet.columns.forEach((column, index) => {
    const headerCell = headerRow.getCell(index + 1)
    headerCell.style = headerColors
  })

  // Función para formatear fechas
  const formatDate = (dateString) => {
    if (!dateString) return '-'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  // Función para formatear sexo
  const formatSex = (sex) => {
    if (!sex) return '-'
    if (sex === 'M') return 'Masculino'
    if (sex === 'F') return 'Femenino'
    return sex
  }

  // Función para formatear especialidad
  const formatSpecialty = (specialty) => {
    if (!specialty) return '-'
    // Si es un objeto, extraer el nombre
    if (typeof specialty === 'object' && specialty !== null) {
      return specialty.name || specialty.nombre || JSON.stringify(specialty)
    }
    // Si es un string, devolverlo tal cual
    return specialty
  }

  // Agregar datos
  postulantes.forEach((postulante, index) => {
    const row = worksheet.addRow({
      id: postulante.id || '-',
      nombre: postulante.nombre || '-',
      correo: postulante.correo || '-',
      documentType: postulante.documentType || '-',
      dni: postulante.dni || '-',
      telefono: postulante.telefono || '-',
      sex: formatSex(postulante.sex),
      fechaNacimiento: formatDate(postulante.fechaNacimiento),
      direccion: postulante.direccion || '-',
      region: postulante.region || '-',
      province: postulante.province || '-',
      district: postulante.district || '-',
      specialty: formatSpecialty(postulante.specialty),
      career: postulante.career || '-',
      semester: postulante.semester || '-',
      experienceLevel: postulante.experienceLevel || '-',
      etapa: postulante.etapa || '-',
      estado: postulante.estado || '-',
      fecha: formatDate(postulante.fecha)
    })

    // Aplicar estilos a las celdas de datos
    row.height = 25
    row.eachCell((cell, colNumber) => {
      cell.style = {
        ...dataStyle,
        fill: index % 2 === 0 ? evenRowFill : oddRowFill
      }

      // Color especial para la columna de estado
      if (colNumber === 18) { // Columna de Estado
        if (postulante.estado === 'Aceptado') {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD1FAE5' } } // Verde pastel
          cell.font = { color: { argb: 'FF065F46' }, bold: true }
        } else if (postulante.estado === 'Rechazado') {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEE2E2' } } // Rojo pastel
          cell.font = { color: { argb: 'FF991B1B' }, bold: true }
        } else {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF3C7' } } // Amarillo pastel
          cell.font = { color: { argb: 'FF92400E' }, bold: true }
        }
      }
    })
  })

  // Congelar la primera fila (cabeceras)
  worksheet.views = [
    { state: 'frozen', ySplit: 1 }
  ]

  // Generar nombre del archivo
  const filterLabels = {
    all: 'Todos',
    accepted: 'Aceptados',
    rejected: 'Rechazados',
    pending: 'En_Proceso'
  }
  const filterLabel = filterLabels[filterType] || 'Todos'
  const fecha = new Date().toISOString().split('T')[0]
  const fileName = `Postulantes_${filterLabel}_${fecha}.xlsx`

  // Generar el buffer y descargar
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

