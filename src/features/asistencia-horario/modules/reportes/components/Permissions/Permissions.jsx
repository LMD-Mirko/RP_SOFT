import React from 'react'
import styles from './Permissions.module.css'

const defaultPermissions = [
  {
    nombre: 'Carlos Ruiz',
    fecha: '2025-09-29',
    departamento: 'Diseño',
    motivo: 'Cita médica',
    detalle: 'Certificado médico adjunto',
    estado: 'Aprobado'
  },
  {
    nombre: 'Laura Martínez',
    fecha: '2025-09-30',
    departamento: 'Ventas',
    motivo: 'Trámite personal',
    detalle: 'Necesito realizar trámites bancarios',
    estado: 'Pendiente'
  },
  {
    nombre: 'Ana García',
    fecha: '2025-10-01',
    departamento: 'Desarrollo',
    motivo: 'Asunto familiar',
    detalle: 'Compromiso familiar urgente',
    estado: 'Aprobado'
  }
]

const defaultSummaryData = [
  { nombre: 'Ana García', departamento: 'Desarrollo', aprobados: 1, limite: 3 },
  { nombre: 'Carlos Ruiz', departamento: 'Diseño', aprobados: 1, limite: 3 },
  { nombre: 'María López', departamento: 'Marketing', aprobados: 0, limite: 3 },
  { nombre: 'Juan Pérez', departamento: 'Desarrollo', aprobados: 0, limite: 3 },
  { nombre: 'Laura Martínez', departamento: 'Ventas', aprobados: 0, limite: 3 }
]

export default function Permissions({
  title = 'Reporte de Permisos',
  description = 'Todos los permisos otorgados - Esta semana',
  dataArray = null,
  mode = 'reporte' // 'reporte' | 'resumen'
}) {
  const data = dataArray || (mode === 'resumen' ? defaultSummaryData : defaultPermissions)

  const getStatusClass = (estado) => {
    switch (estado) {
      case 'Aprobado':
        return styles.aprobado
      case 'Pendiente':
        return styles.pendiente
      case 'Rechazado':
        return styles.rechazado
      default:
        return ''
    }
  }

  const getCountColor = (aprobados) => {
    if (aprobados === 0) return styles.cero
    if (aprobados === 1) return styles.uno
    if (aprobados === 2) return styles.dos
    return styles.tres
  }

  if (mode === 'resumen') {
    return (
      <section className={styles.resumenSection}>
        <h2>{title}</h2>
        <p className={styles.desc}>{description}</p>

        <div className={styles.resumenList}>
          {data.map((p, index) => (
            <div key={index} className={styles.resumenCard}>
              <div className={styles.left}>
                <div className={styles.nombre}>{p.nombre}</div>
                <div className={styles.departamento}>{p.departamento}</div>
              </div>

              <div className={styles.right}>
                <div className={`${styles.count} ${getCountColor(p.aprobados)}`}>
                  {p.aprobados} aprobados
                </div>
                <div className={styles.limite}>{p.aprobados} / {p.limite} máx.</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className={styles.permisosSection}>
      <h2>{title}</h2>
      <p className={styles.desc}>{description}</p>

      <div className={styles.permisosList}>
        {data.map((p, index) => (
          <div key={index} className={styles.permisoCard}>
            <div className={styles.cardHeader}>
              <div className={styles.headerLeft}>
                <div className={styles.nombre}>{p.nombre}</div>
                <div className={styles.meta}>
                  <span className={styles.fecha}>{p.fecha}</span>
                  <span className={styles.separator}>•</span>
                  <span className={styles.departamento}>{p.departamento}</span>
                </div>
              </div>
              <div className={`${styles.status} ${getStatusClass(p.estado)}`}>
                {p.estado}
              </div>
            </div>

            <div className={styles.cardContent}>
              <div className={styles.motivoSection}>
                <div className={styles.motivoLabel}>Motivo: {p.motivo}</div>
                <div className={styles.motivoDetalle}>{p.detalle}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
