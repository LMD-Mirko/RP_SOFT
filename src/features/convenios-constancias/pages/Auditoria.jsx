import { useState, useMemo } from 'react'
import { Search, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Input } from '@shared/components/Input'
import { Select } from '@shared/components/Select'
import { Table } from '@shared/components/UI/Table'
import { mockAuditoria, tiposDocumento, tiposAccion } from '../data/mockAuditoria'
import styles from './Auditoria.module.css'

export default function Auditoria() {
  const [searchTerm, setSearchTerm] = useState('')
  const [tipoFiltro, setTipoFiltro] = useState('todos')
  const [accionFiltro, setAccionFiltro] = useState('todas')

  const filteredData = useMemo(() => {
    return mockAuditoria.filter((item) => {
      const matchesSearch =
        item.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.estudiante.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesTipo = tipoFiltro === 'todos' || 
        (tipoFiltro === 'acuerdo-confidencialidad' && item.documento === 'Acuerdo de Confidencialidad') ||
        (tipoFiltro === 'compromisos-internos' && item.documento === 'Compromisos Internos')
      
      const matchesAccion = accionFiltro === 'todas' || item.accion.tipo === accionFiltro

      return matchesSearch && matchesTipo && matchesAccion
    })
  }, [searchTerm, tipoFiltro, accionFiltro])

  const formatFechaHora = (fechaHora) => {
    const date = new Date(fechaHora)
    const day = date.getDate()
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const renderAccionButton = (accion) => {
    if (accion.tipo === 'firmados') {
      return (
        <button className={styles.btnFirmados}>
          {accion.firmados}/{accion.total} Firmados
        </button>
      )
    } else if (accion.tipo === 'pendiente') {
      return (
        <button className={styles.btnPendiente}>
          <AlertCircle size={16} />
          Pendiente
        </button>
      )
    } else if (accion.tipo === 'generada') {
      return (
        <button className={styles.btnGenerada}>
          <CheckCircle2 size={16} />
          Generada
        </button>
      )
    }
    return null
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Auditoria - RP Firma</h1>
        <p className={styles.subtitle}>Registro completo de todas las acciones realizadas en el sistema</p>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Registro de Auditoria</h2>
          <p className={styles.cardSubtitle}>Historial completo de acciones</p>
        </div>

        <div className={styles.filters}>
          <div className={styles.searchWrapper}>
            <Input
              placeholder="Buscar por estudiante o usuario..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={Search}
              iconPosition="left"
              className={styles.searchInput}
            />
          </div>
          
          <div className={styles.selectsWrapper}>
            <Select
              options={tiposDocumento}
              value={tipoFiltro}
              onChange={(e) => setTipoFiltro(e.target.value)}
              placeholder="Todos los tipos"
              className={styles.select}
            />
            <Select
              options={tiposAccion}
              value={accionFiltro}
              onChange={(e) => setAccionFiltro(e.target.value)}
              placeholder="Todas las Acciones"
              className={styles.select}
            />
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Fecha y Hora</Table.HeaderCell>
                <Table.HeaderCell>Usuario</Table.HeaderCell>
                <Table.HeaderCell>Estudiante</Table.HeaderCell>
                <Table.HeaderCell>Documento</Table.HeaderCell>
                <Table.HeaderCell>Tipo de Firma</Table.HeaderCell>
                <Table.HeaderCell align="center">Accion</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <Table.Row key={item.id}>
                    <Table.Cell>
                      <span className={styles.fechaHora}>{formatFechaHora(item.fechaHora)}</span>
                    </Table.Cell>
                    <Table.Cell>
                      <span className={styles.usuario}>{item.usuario}</span>
                    </Table.Cell>
                    <Table.Cell>
                      <span className={styles.estudiante}>{item.estudiante}</span>
                    </Table.Cell>
                    <Table.Cell>
                      <span className={styles.documento}>{item.documento}</span>
                    </Table.Cell>
                    <Table.Cell>
                      <span className={styles.tipoFirma}>{item.tipoFirma}</span>
                    </Table.Cell>
                    <Table.Cell align="center">
                      {renderAccionButton(item.accion)}
                    </Table.Cell>
                  </Table.Row>
                ))
              ) : (
                <Table.Row>
                  <Table.Cell colSpan={6} align="center">
                    <div className={styles.emptyState}>
                      <p>No se encontraron registros</p>
                    </div>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </div>
      </div>
    </div>
  )
}