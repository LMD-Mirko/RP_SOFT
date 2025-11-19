/**
 * Servicio para generar archivos Excel de usuarios
 */

import ExcelJS from 'exceljs'

/**
 * Genera un archivo Excel con la información de los usuarios
 * @param {Array} usuarios - Array de usuarios a exportar
 * @param {string} filterType - Tipo de filtro aplicado ('all', 'role', 'status')
 */
export const generateUsuariosExcel = async (usuarios, filterType = 'all') => {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Usuarios')

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
    { header: 'Nombre Completo', key: 'fullName', width: 30 },
    { header: 'Correo Electrónico', key: 'email', width: 30 },
    { header: 'Usuario', key: 'username', width: 20 },
    { header: 'Rol', key: 'role', width: 20 },
    { header: 'Estado', key: 'estado', width: 15 },
    { header: 'Proveedor', key: 'provider', width: 15 },
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

  // Función para formatear estado
  const formatEstado = (isActive) => {
    return isActive ? 'Activo' : 'Inactivo'
  }

  // Agregar datos
  usuarios.forEach((usuario, index) => {
    const row = worksheet.addRow({
      id: usuario.id || '-',
      fullName: usuario.fullName || '-',
      email: usuario.email || '-',
      username: usuario.username || '-',
      role: usuario.role || '-',
      estado: formatEstado(usuario.is_active),
      provider: usuario.provider || '-',
      fecha: formatDate(usuario.created_at)
    })

    // Aplicar estilos a las celdas de datos
    row.height = 25
    row.eachCell((cell, colNumber) => {
      // Estilo base
      const baseStyle = {
        ...dataStyle,
        fill: index % 2 === 0 ? evenRowFill : oddRowFill
      }

      // Color especial para la columna de rol
      if (colNumber === 5) { // Columna de Rol
        if (usuario.role_id === 2) {
          cell.style = {
            ...baseStyle,
            alignment: { ...baseStyle.alignment, horizontal: 'center' },
            fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF3C7' } }, // Amarillo pastel
            font: { color: { argb: 'FF92400E' }, bold: true }
          }
        } else {
          cell.style = {
            ...baseStyle,
            alignment: { ...baseStyle.alignment, horizontal: 'center' },
            fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDBEAFE' } }, // Azul pastel
            font: { color: { argb: 'FF1E40AF' }, bold: true }
          }
        }
      }
      // Color especial para la columna de estado
      else if (colNumber === 6) { // Columna de Estado
        if (usuario.is_active) {
          cell.style = {
            ...baseStyle,
            alignment: { ...baseStyle.alignment, horizontal: 'center' },
            fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD1FAE5' } }, // Verde pastel
            font: { color: { argb: 'FF065F46' }, bold: true }
          }
        } else {
          cell.style = {
            ...baseStyle,
            alignment: { ...baseStyle.alignment, horizontal: 'center' },
            fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEE2E2' } }, // Rojo pastel
            font: { color: { argb: 'FF991B1B' }, bold: true }
          }
        }
      } else {
        cell.style = baseStyle
      }
    })
  })

  // Congelar la primera fila (cabeceras)
  worksheet.views = [
    { state: 'frozen', ySplit: 1 }
  ]

  // Generar nombre del archivo
  const fecha = new Date().toISOString().split('T')[0]
  const fileName = `Usuarios_${fecha}.xlsx`

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

