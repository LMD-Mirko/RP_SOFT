import React from 'react'
import styles from './HourDetail.module.css'

const datosEjemplo = [
  {
    nombre: 'Juan Pérez',
    estado: 'Crítico',
    departamento: 'Desarrollo',
    horasSemana: 0,
    metaSemana: 30,
    horasMes: 0,
    metaMes: 120
  },
  {
    nombre: 'Pedro Sánchez',
    estado: 'Crítico',
    departamento: 'Soporte',
    horasSemana: 0,
    metaSemana: 30,
    horasMes: 0,
    metaMes: 120
  }
]

export default function HourDetail({ nombre, estado, departamento, horasSemana, metaSemana, horasMes, metaMes }) {
  const mostrarMultiples = !nombre
  const datos = mostrarMultiples ? datosEjemplo : [{ nombre, estado, departamento, horasSemana, metaSemana, horasMes, metaMes }]

  return (
    <div className={styles.cardsContainer}>
    <div className={styles.container}>
      <h2 className={styles.title}>Reporte Detallado de Horas - Límite Máximo {datos[0]?.metaSemana}h/semana</h2>
      <p className={styles.descripcion}>
        Cumplimiento individual de la meta semanal. El sistema está configurado para un máximo de {datos[0]?.metaSemana} horas semanales.
      </p>
      
        {datos.map((dato, index) => {
          const porcentaje = Math.round((dato.horasSemana / dato.metaSemana) * 100)
          const horasFaltantes = Math.max(dato.metaSemana - dato.horasSemana, 0)

          return (
            <div key={index} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.nameSection}>
                  <h3 className={styles.name}>{dato.nombre}</h3>
                  <span className={`${styles.estado} ${dato.estado === 'Crítico' ? styles.critico : ''}`}>
                    {dato.estado}
                  </span>
                </div>
                <div className={styles.rightTop}>
                  <p className={styles.horasTotal}>{dato.horasSemana}h / {dato.metaSemana}h</p>
                  <p className={styles.porcentaje}>{porcentaje}% de la meta</p>
                </div>
              </div>

              <p className={styles.departamento}>{dato.departamento}</p>

              <div className={styles.rowItem}>
                <span className={styles.label}>Progreso semanal:</span>
                <span className={styles.value}>{dato.horasSemana}/{dato.metaSemana}h</span>
              </div>

              <div className={styles.progressBarContainer}>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill} 
                    style={{ width: `${Math.min(porcentaje, 100)}%` }} 
                  />
                </div>
              </div>

              <div className={styles.rowItem}>
                <span className={styles.label}>Horas faltantes:</span>
                <span className={`${styles.value} ${horasFaltantes > 0 ? styles.warning : ''}`}>
                  {horasFaltantes}h
                </span>
              </div>

              <div className={styles.rowItem}>
                <span className={styles.label}>Proyección mensual:</span>
                <span className={styles.value}>{dato.horasMes}h / {dato.metaMes}h</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
