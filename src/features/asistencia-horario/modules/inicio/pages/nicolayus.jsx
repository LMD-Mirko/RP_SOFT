import { useState } from 'react'
import { StatsCards } from '../components/StatsCards'
import { InfCards } from '../components/InfCards'
import { InfAlertCard } from '../components/InfAlertCard'
import styles from './Dashboard.module.css'

// Datos de ejemplo basados en el diseño

export function Inicio() {

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h1>Bienvenido, Juan Pérez</h1>
          <p>Aquí está tu resumen de desempeño personal</p>
        </div>
      </div>

              <StatsCards />
        <div className={styles.progres}>
          <h2>Progreso Semanal</h2>
            <div className={styles.progresSection1}>
                <div className={styles.progresSubtitle}>
                    <h3>Horas trabajadas esta semana</h3>
                    <h3>32/40 horas</h3>
                </div>
                <progress value="80" max="100"></progress>
            </div>

            <div className={styles.progresSection2}>
                <div className={styles.progresSubtitle}>
                    <h3>Cumplimiento de meta</h3>
                    <h3>80%</h3>
                </div>
                <progress value="80" max="100"></progress>
            </div>
        </div>


      <InfAlertCard />
      <InfCards />
    </div>
  )
}