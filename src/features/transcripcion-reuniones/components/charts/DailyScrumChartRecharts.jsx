import { useMemo, useState } from 'react'
import styles from '../../modules/daily-scrum/pages/DailyScrumPage.module.css'
import AnimatedAreaChart from './AnimatedAreaChart'
import { useEffect } from 'react'

function generateSeries(length, min, max, labels) {
  const arr = []
  let val = min + Math.random() * (max - min)
  for (let i = 0; i < length; i++) {
    const target = min + Math.random() * (max - min)
    val = val * 0.7 + target * 0.3
    arr.push({ label: labels[i], transcriptions: Math.round(val) })
  }
  return arr
}

export function DailyScrumChartRecharts({ onViewChange, onStatsChange }) {
  const [view, setView] = useState('Mes')

  const datasets = useMemo(() => ({
    Dia: generateSeries(12, 6, 16, Array.from({ length: 12 }, (_, i) => `${i + 8}:00`)),
    Semana: generateSeries(7, 10, 80, ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']),
    Mes: generateSeries(30, 600, 2000, Array.from({ length: 30 }, (_, i) => `${i + 1}`)),
    Año: generateSeries(12, 800, 2400, ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']),
  }), [])

  const data = datasets[view]

  // Notificar cambios de vista y actualizar tarjetas con estadísticas
  useEffect(() => {
    onViewChange && onViewChange(view)
    if (onStatsChange && Array.isArray(data)) {
      const total = data.reduce((sum, d) => sum + (d.transcriptions || 0), 0)
      const dailyAvg = Math.round(total / Math.max(1, data.length))
      onStatsChange({ dailyCount: dailyAvg, totalCount: total })
    }
  }, [view])

  return (
    <div className={styles.chartFadeIn}>
      <div className={styles.tabs}>
        {['Día', 'Semana', 'Mes', 'Año'].map((label, idx) => {
          const key = label.replace('í', 'i')
          return (
            <button
              key={label}
              onClick={() => setView(key)}
              className={`${styles.tab} ${view === key ? styles.tabActive : ''}`}
            >
              {label}
            </button>
          )
        })}
      </div>

      <AnimatedAreaChart data={data} />
    </div>
  )
}