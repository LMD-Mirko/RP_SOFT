import React from 'react';
import styles from './ContentWarnings.module.css'

const defaultData = [
  { nombre: 'Ana García', departamento: 'Desarrollo', advertencias: 0 },
  { nombre: 'Carlos Ruiz', departamento: 'Diseño', advertencias: 0 },
  { nombre: 'María López', departamento: 'Marketing', advertencias: 1 },
  { nombre: 'Juan Pérez', departamento: 'Desarrollo', advertencias: 2, estado: 'En entrevista' },
  { nombre: 'Laura Martínez', departamento: 'Ventas', advertencias: 0 },
];

export default function ContentWarnings({ 
  title = "Reporte de Advertencias",
  description = "Detalle por practicante - Mes actual",
  dataArray = null,
  mode = 'reporte' // 'reporte' | 'historial'
}) {
  const data = dataArray || defaultData;

  if (mode === 'historial') {
    return (
      <section className={styles.historialSection}>
        <h2>{title}</h2>
        <p>{description}</p>

        <div className={styles.historialList}>
          {data.map((p, index) => (
            <div key={index} className={styles.historialCard}>
              <div className={styles.cardInfo}>
                <div className={styles.name}>{p.nombre}</div>
                {p.fecha && <div className={styles.historialDate}>{p.fecha}</div>}
                {p.descripcion && <div className={styles.historialDesc}>{p.descripcion}</div>}
              </div>

              {p.tag && (
                <div className={styles.tagBadge} aria-label={p.tag}>
                  {p.tag}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className={styles.reporteSection}>
      <h2>{title}</h2>
      <p>{description}</p>

      <div className={styles.reporteList}>
        {data.map((p, index) => (
          <div
            key={index}
            className={`${styles.reporteCard} ${p.advertencias > 0 ? styles.conAdvertencias : ''}`}
          >
            <div className={styles.cardInfo}>
              <div className={styles.name}>{p.nombre}</div>
              <div className={styles.department}>{p.departamento}</div>
            </div>

            <div className={styles.badge} aria-label={`${p.advertencias} advertencias`}>
              {p.advertencias} advertencias
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
