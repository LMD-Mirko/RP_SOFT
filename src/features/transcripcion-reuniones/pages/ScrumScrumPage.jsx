import styles from './ScrumScrumPage.module.css'
import { TranscripcionesPage } from './TranscripcionesPage.jsx'
import { DailyScrumChartRecharts } from '../components/DailyScrumChartRecharts'
import { useState } from 'react'

export function ScrumScrumPage() {
  const [dailyCount, setDailyCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Scrum de Scrum</h1>
      <p className={styles.subtitle}>Vista de transcripciones y métricas del equipo</p>

      {/* Gráfico semanal y tarjetas (estilo segunda imagen) */}

      {/* Panel completo de Transcripciones, tal cual el apartado original */}
      <section className={styles.section}>
        <TranscripcionesPage />
      </section>

      {/* Gráfico de área (evolución), con tarjetas a la derecha */}
      <section className={styles.section}>
        <div className={styles.weeklyLayout}>
          <div className={styles.chartBox}>
            <div className={styles.chartTitle}>Evolución de transcripciones</div>
            <DailyScrumChartRecharts
              onStatsChange={({ dailyCount, totalCount }) => {
                setDailyCount(dailyCount)
                setTotalCount(totalCount)
              }}
            />
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

export default ScrumScrumPage