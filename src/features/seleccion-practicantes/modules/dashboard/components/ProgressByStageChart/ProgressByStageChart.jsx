import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useMemo } from 'react'
import styles from './ProgressByStageChart.module.css'

const COLOR_SCHEME = [
  { gradient: ['#111827', '#1f2937'], solid: '#111827' },
  { gradient: ['#374151', '#4b5563'], solid: '#374151' },
  { gradient: ['#1f2937', '#111827'], solid: '#1f2937' },
  { gradient: ['#4b5563', '#374151'], solid: '#4b5563' },
  { gradient: ['#111827', '#000000'], solid: '#111827' },
  { gradient: ['#6b7280', '#4b5563'], solid: '#6b7280' },
  { gradient: ['#9ca3af', '#6b7280'], solid: '#9ca3af' },
]

export function ProgressByStageChart({ data = [] }) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return []
    return data.map((item) => ({
      name: item.stage?.replace(/^\d+\.\s*/, '') || item.stage,
      completionRate: item.completion_rate || 0,
      completed: item.completed_count || 0,
      total: item.total_count || 0,
    }))
  }, [data])

  const total = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.total, 0)
  }, [chartData])

  // Siempre mostrar el gráfico, incluso sin datos
  // if (!data || data.length === 0) {
  //   return (
  //     <div className={styles.container}>
  //       <div className={styles.header}>
  //         <h3 className={styles.title}>Progreso por Etapa</h3>
  //       </div>
  //       <div className={styles.emptyState}>
  //         <div className={styles.emptyIcon}>📊</div>
  //         <p className={styles.emptyText}>No hay datos disponibles</p>
  //       </div>
  //     </div>
  //   )
  // }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className={styles.tooltip}>
          <p className={styles.tooltipLabel}>{data.name}</p>
          <p className={styles.tooltipValue}>
            <span className={styles.tooltipNumber}>{data.completionRate.toFixed(1)}%</span>
          </p>
          <p className={styles.tooltipDetail}>
            {data.completed} de {data.total} postulantes
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>Progreso por Etapa</h3>
          <p className={styles.subtitle}>Tasa de completado por etapa</p>
        </div>
        <div className={styles.badge}>
          <span className={styles.badgeNumber}>{total}</span>
          <span className={styles.badgeLabel}>Total</span>
        </div>
      </div>
      
      <div className={styles.chartContent}>
        {chartData.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📊</div>
            <p className={styles.emptyText}>No hay datos disponibles</p>
            <p className={styles.emptySubtext}>Los datos aparecerán cuando haya información de progreso</p>
          </div>
        ) : (
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart 
                data={chartData} 
                margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
              >
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={1} />
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false} 
                stroke="rgba(0, 0, 0, 0.05)"
              />
              <XAxis 
                dataKey="name"
                tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 500 }}
                axisLine={{ stroke: 'rgba(0, 0, 0, 0.08)' }}
                tickLine={false}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                domain={[0, 100]}
                tick={{ fill: '#6b7280', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={40}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '5 5' }} />
              <Area
                type="monotone"
                dataKey="completionRate"
                stroke="url(#lineGradient)"
                strokeWidth={3}
                fill="url(#areaGradient)"
                dot={{ fill: '#3b82f6', r: 4, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
                animationBegin={0}
                animationDuration={1200}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        )}
      </div>
    </div>
  )
}

