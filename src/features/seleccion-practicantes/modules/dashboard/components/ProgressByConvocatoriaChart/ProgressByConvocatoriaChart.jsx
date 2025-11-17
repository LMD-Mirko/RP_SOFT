import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useMemo } from 'react'
import { EmptyState } from '@shared/components/EmptyState'
import styles from './ProgressByConvocatoriaChart.module.css'

export function ProgressByConvocatoriaChart({ data = [] }) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return []
    return data.map((item) => ({
      name: item.convocatoria_title?.substring(0, 20) || `Convocatoria ${item.convocatoria_id}`,
      fullName: item.convocatoria_title || `Convocatoria ${item.convocatoria_id}`,
      progress: item.average_progress || 0,
      total: item.total_postulants || 0,
      completed: item.completed_count || 0,
      inProgress: item.in_progress_count || 0,
      notStarted: item.not_started_count || 0,
    }))
  }, [data])

  // Siempre mostrar el gráfico, incluso sin datos
  // if (!data || data.length === 0) {
  //   return (
  //     <div className={styles.container}>
  //       <div className={styles.header}>
  //         <h3 className={styles.title}>Progreso por Convocatoria</h3>
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
          <p className={styles.tooltipLabel}>{data.fullName}</p>
          <p className={styles.tooltipValue}>
            <span className={styles.tooltipNumber}>{data.progress.toFixed(1)}%</span>
            <span className={styles.tooltipUnit}> promedio</span>
          </p>
          <div className={styles.tooltipDetails}>
            <p className={styles.tooltipDetail}>
              <span className={styles.tooltipDetailLabel}>Total:</span> {data.total} postulantes
            </p>
            <p className={styles.tooltipDetail}>
              <span className={styles.tooltipDetailLabel}>Completados:</span> {data.completed}
            </p>
            <p className={styles.tooltipDetail}>
              <span className={styles.tooltipDetailLabel}>En progreso:</span> {data.inProgress}
            </p>
            <p className={styles.tooltipDetail}>
              <span className={styles.tooltipDetailLabel}>Sin iniciar:</span> {data.notStarted}
            </p>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>Progreso por Convocatoria</h3>
          <p className={styles.subtitle}>Comparación de progreso promedio</p>
        </div>
        <div className={styles.badge}>
          <span className={styles.badgeNumber}>{chartData.length}</span>
          <span className={styles.badgeLabel}>Convocatorias</span>
        </div>
      </div>
      
      <div className={styles.chartContent}>
        {chartData.length === 0 ? (
          <EmptyState
            iconPreset="calendar"
            colorPreset="green"
            title="No hay datos disponibles"
            description="Los datos aparecerán cuando haya información de progreso por convocatoria"
            className={styles.emptyState}
          />
        ) : (
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
              data={chartData} 
              margin={{ top: 10, right: 30, left: 0, bottom: 80 }}
            >
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#E6B3FF" stopOpacity={1} />
                  <stop offset="50%" stopColor="#B3D9FF" stopOpacity={1} />
                  <stop offset="100%" stopColor="#B3FFD9" stopOpacity={1} />
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
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#B3D9FF', strokeWidth: 2, strokeDasharray: '5 5' }} />
              <Legend 
                verticalAlign="top"
                height={36}
                formatter={(value) => (
                  <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#374151' }}>
                    Progreso Promedio
                  </span>
                )}
              />
              <Line
                type="monotone"
                dataKey="progress"
                stroke="url(#lineGradient)"
                strokeWidth={3}
                dot={{ fill: '#E6B3FF', r: 5, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 7, strokeWidth: 2, stroke: '#fff', fill: '#B3D9FF' }}
                animationBegin={0}
                animationDuration={1500}
                animationEasing="ease-out"
                name="progress"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        )}
      </div>
    </div>
  )
}

