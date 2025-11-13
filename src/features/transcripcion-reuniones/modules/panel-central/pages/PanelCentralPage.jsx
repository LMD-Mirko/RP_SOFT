import { useState } from 'react'
import styles from './PanelCentralPage.module.css'
import { CalendarDays, ShieldAlert, CheckCircle2, Users } from 'lucide-react'

export function PanelCentralPage() {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.title}>Panel Central</div>
          <div className={styles.subtitle}>Vista unificada de todos los proyectos y equipos</div>
        </div>
        <div className={styles.datePicker}>
          <input
            className={styles.dateInput}
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <CalendarDays size={18} />
        </div>
      </div>

      <div className={styles.cards}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span>Proyectos Activos</span>
            <ShieldAlert size={16} />
          </div>
          <div className={styles.metric}>0</div>
          <div className={styles.chipRow}>
            <span className={`${styles.chip} ${styles.chipGreen}`}>0 Verde</span>
            <span className={`${styles.chip} ${styles.chipAmber}`}>0 Ámbar</span>
            <span className={`${styles.chip} ${styles.chipRed}`}>0 Rojo</span>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span>Bloqueos</span>
            <ShieldAlert size={16} />
          </div>
          <div className={styles.metric}>0</div>
          <div className={styles.muted}>0 críticos requieren atención inmediata</div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span>Acuerdos Pendientes</span>
            <CheckCircle2 size={16} />
          </div>
          <div className={styles.metric}>0</div>
          <div className={styles.muted}>0 vencidos necesitan seguimiento</div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span>Equipos Reportando</span>
            <Users size={16} />
          </div>
          <div className={styles.metric}>0/0</div>
          <div className={styles.progress}><div className={styles.progressFill} /></div>
          <div className={styles.muted}>0% completado</div>
        </div>
      </div>

      <div className={styles.filters}>
        <span className={styles.filterChip}>Todos (0)</span>
        <span className={styles.filterChip}>Críticos (0)</span>
        <span className={styles.filterChip}>En Riesgo (0)</span>
        <span className={styles.filterChip}>Bloqueos (0)</span>
        <span className={styles.filterChip}>Dependencias (0)</span>
      </div>
    </div>
  )
}