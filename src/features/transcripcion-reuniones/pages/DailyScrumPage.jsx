import styles from './DailyScrumPage.module.css'
import { useMemo } from 'react'
import WeeklyTranscriptionsBarChart from '../components/WeeklyTranscriptionsBarChart'

export function DailyScrumPage() {
  const dailyCount = useMemo(() => Math.floor(6 + Math.random() * 10), [])
  const totalCount = useMemo(() => Math.floor(30 + Math.random() * 80), [])
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Daily Scrum</h1>
      <p className={styles.subtitle}>Métricas y evolución de transcripciones del día</p>

      {/* Bloque principal: gráfico a la izquierda, tarjetas a la derecha */}
      <section className={styles.section}>
        <div className={styles.weeklyLayout}>
          <div className={styles.chartBox}>
            <div className={styles.chartTitle}>Transcripciones por semana</div>
            <WeeklyTranscriptionsBarChart />
          </div>

          <div className={styles.statsGrid}>
            <div className={styles.card}>
              <div className={styles.cardTitle}>Transcripciones por día</div>
              <div className={styles.cardNumber}>{dailyCount}</div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardTitle}>Transcripciones Totales</div>
              <div className={styles.cardNumber}>{totalCount}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default DailyScrumPage