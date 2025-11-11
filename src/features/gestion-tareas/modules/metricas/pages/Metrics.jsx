import React from 'react'
import { Share2, CheckCircle2, Gauge, Timer, Target, TrendingUp } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Avatar } from '../components/ui/Avatar'
import { Progress } from '../components/ui/Progress'
import { TinyBarChart } from '../components/TinyBarChart'
import { TinyLineChart } from '../components/TinyLineChart'
import { useMetrics } from '../../../hooks/useMetrics'
import styles from '../styles/pages/Metrics.module.css'

export const Metrics = () => {
  const { loading, stats, velocity, burndown, team } = useMetrics()

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={`${styles.content} ${styles.panel}`} style={{ padding: '2rem' }}>
          <span className={styles.subtitle}>Cargando...</span>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Métricas de Tareas</h1>
            <p className={styles.subtitle}>Análisis de desempeño y productividad del equipo</p>
          </div>
          <div className={styles.actions}>
            <Badge variant="success">Sprint Actual</Badge>
            <Button variant="light"><Share2 size={18} className={styles.iconLeft} /> Reportar</Button>
          </div>
        </div>

        <div className={styles.gridStats}>
          <Card title="Velocidad Promedio" value={`${stats.find(s => s.id === 'velocidad')?.valor} ${stats.find(s => s.id === 'velocidad')?.sufijo || ''}`} icon={Gauge} color="blue" />
          <Card title="Tasa de Completitud" value={stats.find(s => s.id === 'completitud')?.valor} icon={CheckCircle2} color="green" />
          <Card title="Tiempo Promedio" value={`${stats.find(s => s.id === 'tiempo')?.valor} ${stats.find(s => s.id === 'tiempo')?.sufijo || ''}`} icon={Timer} color="violet" />
          <Card title="Precisión de Estimación" value={stats.find(s => s.id === 'precision')?.valor} icon={Target} color="orange" />
        </div>

        <div className={styles.gridCharts}>
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <div className={styles.labelSmMuted}>Velocidad de equipo</div>
                <div className={styles.labelXsMuted}>Puntos completados por sprint</div>
              </div>
              <TrendingUp size={18} className={`${styles.iconMuted} ${styles.panelHeaderIcon}`} />
            </div>
            <TinyBarChart labels={velocity.labels} values={velocity.values} />
          </div>

          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <div>
                <div className={styles.labelSmMuted}>Burndown Chart</div>
                <div className={styles.labelXsMuted}>Progreso del sprint real vs ideal</div>
              </div>
              <TrendingUp size={18} className={`${styles.iconMuted} ${styles.panelHeaderIcon}`} />
            </div>
            <TinyLineChart labels={burndown.labels} ideal={burndown.ideal} real={burndown.real} />
          </div>
        </div>

        <div className={styles.panel}>
          <div className={styles.mb4}>
            <div className={styles.memberName} style={{ fontSize: '1.125rem' }}>Desempeño del equipo</div>
            <div className={styles.memberMeta}>Rendimiento individual en el sprint actual</div>
          </div>
          <div className={styles.list}>
            {team.map((m) => (
              <div key={m.id} className={styles.memberRow}>
                <div className={styles.memberHeader}>
                  <Avatar initials={m.iniciales} />
                  <div className={styles.memberBody}>
                    <div className={styles.memberHeaderRow}>
                      <div className={styles.memberName}>{m.nombre}</div>
                      <Badge variant="neutral">{m.rol}</Badge>
                    </div>
                    <div className={styles.memberMeta}>
                      {m.tareas} tareas • {m.puntos} puntos
                      <span className={m.tendencia.includes('-') ? styles.tendencyNegative : styles.tendencyPositive}>
                        {' '}{m.tendencia}
                      </span>
                    </div>
                  </div>
                </div>
                <Progress value={m.progreso} max={100} color={m.tendencia.includes('-') ? 'orange' : 'green'} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Metrics
