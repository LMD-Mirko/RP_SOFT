import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts'
import { useMemo } from 'react'
import { EmptyState } from '@shared/components/EmptyState'
import styles from './ProgressBySpecialtyChart.module.css'

const COLOR_SCHEME = [
  { gradient: ['#B3D9FF', '#99CCFF'], solid: '#B3D9FF' }, // Azul pastel
  { gradient: ['#E6B3FF', '#D699FF'], solid: '#E6B3FF' }, // Morado pastel
  { gradient: ['#FFF4B3', '#FFE699'], solid: '#FFF4B3' }, // Amarillo pastel
  { gradient: ['#FFD9B3', '#FFCC99'], solid: '#FFD9B3' }, // Naranja pastel
  { gradient: ['#B3FFD9', '#99FFCC'], solid: '#B3FFD9' }, // Verde pastel
  { gradient: ['#B3FFF0', '#99FFE6'], solid: '#B3FFF0' }, // Turquesa pastel
]

export function ProgressBySpecialtyChart({ data = [] }) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return []
    return data.map((item) => ({
      name: item.specialty_name || 'Sin especialidad',
      averageProgress: item.average_progress || 0,
      totalPostulants: item.total_postulants || 0,
    }))
  }, [data])

  const total = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.totalPostulants, 0)
  }, [chartData])

  // Siempre mostrar el gráfico, incluso sin datos
  // if (!data || data.length === 0) {
  //   return (
  //     <div className={styles.container}>
  //       <div className={styles.header}>
  //         <h3 className={styles.title}>Progreso por Especialidad</h3>
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
      const progressPayload = payload.find(p => p.dataKey === 'averageProgress')
      const totalPayload = payload.find(p => p.dataKey === 'totalPostulants')
      
      return (
        <div className={styles.tooltip}>
          <p className={styles.tooltipLabel}>{data.name}</p>
          {progressPayload && (
            <p className={styles.tooltipValue}>
              <span style={{ color: progressPayload.color }}>Progreso: </span>
              <span className={styles.tooltipNumber}>{data.averageProgress.toFixed(1)}%</span>
            </p>
          )}
          {totalPayload && (
            <p className={styles.tooltipDetail}>
              <span style={{ color: totalPayload.color }}>Total: </span>
              {data.totalPostulants} postulantes
            </p>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>Progreso por Especialidad</h3>
          <p className={styles.subtitle}>Promedio de progreso</p>
        </div>
        <div className={styles.badge}>
          <span className={styles.badgeNumber}>{total}</span>
          <span className={styles.badgeLabel}>Total</span>
        </div>
      </div>
      
      <div className={styles.chartContent}>
        {chartData.length === 0 ? (
          <EmptyState
            iconPreset="users"
            colorPreset="dark"
            iconColor="#0f172a"
            title="No hay datos disponibles"
            description="Los datos aparecerán cuando haya información de progreso por especialidad"
            className={styles.emptyState}
          />
        ) : (
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart 
              data={chartData} 
              margin={{ top: 10, right: 30, left: 0, bottom: 80 }}
            >
              <defs>
                {chartData.map((entry, index) => {
                  const colorScheme = COLOR_SCHEME[index % COLOR_SCHEME.length]
                  return (
                    <linearGradient key={`gradient-${index}`} id={`barGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={colorScheme.gradient[0]} stopOpacity={0.8} />
                      <stop offset="100%" stopColor={colorScheme.gradient[1]} stopOpacity={0.6} />
                    </linearGradient>
                  )
                })}
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#B3FFD9" stopOpacity={1} />
                  <stop offset="100%" stopColor="#99FFCC" stopOpacity={1} />
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
                yAxisId="left"
                domain={[0, 100]}
                tick={{ fill: '#6b7280', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={40}
                tickFormatter={(value) => `${value}%`}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                domain={[0, 'dataMax + 10']}
                tick={{ fill: '#6b7280', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.02)' }} />
              <Legend 
                verticalAlign="top"
                height={36}
                formatter={(value) => (
                  <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#374151' }}>
                    {value === 'averageProgress' ? 'Progreso Promedio' : 'Total Postulantes'}
                  </span>
                )}
              />
              <Bar 
                yAxisId="left"
                dataKey="averageProgress" 
                fill="url(#barGradient-0)"
                radius={[8, 8, 0, 0]}
                animationBegin={0}
                animationDuration={800}
                name="averageProgress"
              >
                {chartData.map((entry, index) => {
                  const colorScheme = COLOR_SCHEME[index % COLOR_SCHEME.length]
                  return (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={`url(#barGradient-${index})`}
                      style={{
                        filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))',
                      }}
                    />
                  )
                })}
              </Bar>
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="totalPostulants"
                stroke="url(#lineGradient)"
                strokeWidth={3}
                dot={{ fill: '#B3FFD9', r: 4, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
                animationBegin={200}
                animationDuration={1000}
                animationEasing="ease-out"
                name="totalPostulants"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        )}
      </div>
    </div>
  )
}

