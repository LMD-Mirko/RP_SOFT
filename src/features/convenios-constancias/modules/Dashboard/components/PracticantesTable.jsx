/**
 * Componente PracticantesTable
 * Tabla para mostrar la lista de practicantes
 */

import { ChevronDown, FileText, Eye, MoreVertical } from 'lucide-react'
import styles from '../styles/Dashboard.module.css'

export function PracticantesTable({ practicantes, totalCount }) {
  return (
    <div className={styles.tableContainer}>
      {/* Encabezado de la tabla */}
      <div className={styles.tableHeader}>
        <div className={styles.tableHeaderLeft}>
          <h3 className={styles.tableTitle}>Todos los Practicantes ({totalCount})</h3>
          <button className={styles.tableFilterButton}>
            <span>Todos ({totalCount})</span>
            <ChevronDown size={16} />
          </button>
        </div>
        <button className={styles.massActionButton}>
          <FileText size={16} />
          Acciones masivas
        </button>
      </div>

      {/* Tabla */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.tableHead}>
                <input type="checkbox" className={styles.checkbox} />
              </th>
              <th className={styles.tableHead}>Practicante</th>
              <th className={styles.tableHead}>DNI</th>
              <th className={styles.tableHead}>Programa</th>
              <th className={styles.tableHead}>Fase</th>
              <th className={styles.tableHead}>Estado</th>
              <th className={styles.tableHead}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {practicantes.map((practicante) => (
              <tr key={practicante.id} className={styles.tableRow}>
                <td className={styles.tableCell}>
                  <input type="checkbox" className={styles.checkbox} />
                </td>
                <td className={styles.tableCell}>
                  <div className={styles.practicanteInfo}>
                    <div className={styles.avatar}>
                      {practicante.nombre.charAt(0)}
                    </div>
                    <span className={styles.practicanteNombre}>{practicante.nombre}</span>
                  </div>
                </td>
                <td className={styles.tableCell}>{practicante.dni}</td>
                <td className={styles.tableCell}>{practicante.programa}</td>
                <td className={styles.tableCell}>
                  <span className={styles.faseTag}>{practicante.fase}</span>
                </td>
                <td className={styles.tableCell}>
                  <span className={`${styles.estadoBadge} ${styles[`estado${practicante.estado.replace(/\s/g, '').toLowerCase()}`] || ''}`}>
                    {practicante.estado}
                  </span>
                </td>
                <td className={styles.tableCell}>
                  <div className={styles.actionButtons}>
                    <button className={styles.actionBtn} title="Ver detalles">
                      <Eye size={16} />
                    </button>
                    <button className={styles.actionBtn} title="Más opciones">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
