import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { useMemo } from 'react'
import { EmptyState } from '@shared/components/EmptyState'
import styles from './ProgressDistributionChart.module.css'

const COLOR_SCHEME = [
  { gradient: ['#FFF4B3', '#FFE699'], solid: '#FFF4B3' }, // Amarillo pastel
  { gradient: ['#FFD9B3', '#FFCC99'], solid: '#FFD9B3' }, // Naranja pastel
  { gradient: ['#B3D9FF', '#99CCFF'], solid: '#B3D9FF' }, // Azul pastel
  { gradient: ['#B3FFD9', '#99FFCC'], solid: '#B3FFD9' }, // Verde pastel
]

export function ProgressDistributionChart({ data = {} }) {
  const chartData = useMemo(() => {
    if (!data || Object.keys(data).length === 0) return []
    
    const ranges = [
      { key: '0-25%', label: '0-25%', color: COLOR_SCHEME[0] },
      { key: '26-50%', label: '26-50%', color: COLOR_SCHEME[1] },
      { key: '51-75%', label: '51-75%', color: COLOR_SCHEME[2] },
      { key: '76-100%', label: '76-100%', color: COLOR_SCHEME[3] },
    ]
    
    return ranges.map(range => ({
      name: range.label,
      value: data[range.key] || 0,
      color: range.color,
    }))
  }, [data])

  const total = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.value, 0)
  }, [chartData])

  // Siempre mostrar el gráfico, incluso sin datos
  // if (!data || Object.keys(data).length === 0 || total === 0) {
  //   return (
  //     <div className={styles.container}>
  //       <div className={styles.header}>
  //         <h3 className={styles.title}>Distribución de Progreso</h3>
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
      const percentage = total > 0 ? ((data.value / total) * 100).toFixed(1) : 0
      return (
        <div className={styles.tooltip}>
          <p className={styles.tooltipLabel}>{data.name}</p>
          <p className={styles.tooltipValue}>
            <span className={styles.tooltipNumber}>{data.value}</span>
            <span className={styles.tooltipUnit}> postulantes</span>
          </p>
          <p className={styles.tooltipPercentage}>{percentage}% del total</p>
        </div>
      )
    }
    return null
  }

  // Calcular porcentajes para las etiquetas
  const chartDataWithPercentage = useMemo(() => {
    return chartData.map(item => ({
      ...item,
      percentage: total > 0 ? ((item.value / total) * 100).toFixed(1) : 0
    }))
  }, [chartData, total])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>Distribución de Progreso</h3>
          <p className={styles.subtitle}>Postulantes por rango de progreso</p>
        </div>
        <div className={styles.badge}>
          <span className={styles.badgeNumber}>{total}</span>
          <span className={styles.badgeLabel}>Total</span>
        </div>
      </div>
      
      <div className={styles.chartContent}>
        {chartData.length === 0 || total === 0 ? (
          <EmptyState
            iconPreset="chart"
            colorPreset="dark"
            iconColor="#0f172a"
            title="No hay datos disponibles"
            description="Los datos aparecerán cuando haya información de progreso"
            className={styles.emptyState}
          />
        ) : (
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
              <defs>
                {chartData.map((entry, index) => (
                  <linearGradient key={`gradient-${index}`} id={`pieGradient-${index}`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={entry.color.gradient[0]} stopOpacity={1} />
                    <stop offset="100%" stopColor={entry.color.gradient[1]} stopOpacity={1} />
                  </linearGradient>
                ))}
              </defs>
              <Pie
                data={chartDataWithPercentage}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => percent > 0.05 ? `${name}: ${(percent * 100).toFixed(0)}%` : ''}
                outerRadius={90}
                innerRadius={55}
                fill="#8884d8"
                dataKey="value"
                animationBegin={0}
                animationDuration={1000}
                animationEasing="ease-out"
              >
                {chartDataWithPercentage.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={`url(#pieGradient-${index})`}
                    style={{
                      filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))',
                    }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value, entry) => (
                  <span style={{ color: entry.color, fontSize: '0.875rem', fontWeight: 500 }}>
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        )}
      </div>
    </div>
  )
}

