import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { useMemo } from 'react'
import styles from './PostulantsStatusChart.module.css'

// Paleta de colores pasteles
const COLOR_SCHEME = {
  'Personal Data': {
    gradient: ['#B3D9FF', '#99CCFF'],
    solid: '#B3D9FF',
    light: '#f3f4f6',
  },
  'Completed': {
    gradient: ['#B3FFD9', '#99FFCC'],
    solid: '#B3FFD9',
    light: '#f9fafb',
  },
  'CV': {
    gradient: ['#FFF4B3', '#FFE699'],
    solid: '#FFF4B3',
    light: '#f3f4f6',
  },
  'Profile': {
    gradient: ['#E6B3FF', '#D699FF'],
    solid: '#E6B3FF',
    light: '#f9fafb',
  },
  'Technical': {
    gradient: ['#FFD9B3', '#FFCC99'],
    solid: '#FFD9B3',
    light: '#f3f4f6',
  },
}

const getStatusColor = (status) => {
  return COLOR_SCHEME[status]?.solid || '#B3D9FF'
}

const getStatusGradient = (status) => {
  return COLOR_SCHEME[status]?.gradient || ['#B3D9FF', '#99CCFF']
}

export function PostulantsStatusChart({ data = [] }) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return []
    const total = data.reduce((sum, item) => sum + item.count, 0)
    return data.map((item) => ({
      name: item.status,
      value: item.count,
      percentage: item.percentage || (total > 0 ? (item.count / total) * 100 : 0),
      fill: getStatusColor(item.status),
    }))
  }, [data])

  const total = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.value, 0)
  }, [chartData])

  if (!data || data.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h3 className={styles.title}>Estados de Postulantes</h3>
          <div className={styles.badge}>{total}</div>
        </div>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📊</div>
          <p className={styles.emptyText}>No hay datos disponibles</p>
        </div>
      </div>
    )
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      const status = data.name
      const colorScheme = COLOR_SCHEME[status] || {}
      
      return (
        <div className={styles.tooltip}>
          <div 
            className={styles.tooltipIndicator}
            style={{ background: `linear-gradient(135deg, ${colorScheme.gradient?.[0] || '#B3D9FF'}, ${colorScheme.gradient?.[1] || '#99CCFF'})` }}
          />
          <div className={styles.tooltipContent}>
            <p className={styles.tooltipLabel}>{data.name}</p>
            <p className={styles.tooltipValue}>
              <span className={styles.tooltipNumber}>{data.value}</span>
              <span className={styles.tooltipUnit}> postulantes</span>
            </p>
            <p className={styles.tooltipPercentage}>{data.payload.percentage}% del total</p>
          </div>
        </div>
      )
    }
    return null
  }

  const CustomLabel = (props) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props
    // El payload contiene todos los datos del item, incluyendo percentage
    const payload = props.payload || {}
    
    if (percent < 0.05) return null // No mostrar etiquetas muy pequeñas
    
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.65
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)
    
    // Usar el percentage del payload si está disponible, sino calcular desde percent
    const displayPercentage = payload.percentage !== undefined 
      ? payload.percentage.toFixed(1) 
      : (percent * 100).toFixed(0)

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={13}
        fontWeight="700"
        className={styles.chartLabel}
      >
        {`${displayPercentage}%`}
      </text>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>Estados de Postulantes</h3>
          <p className={styles.subtitle}>Distribución por etapa</p>
        </div>
        <div className={styles.badge}>
          <span className={styles.badgeNumber}>{total}</span>
          <span className={styles.badgeLabel}>Total</span>
        </div>
      </div>
      
      <div className={styles.chartContent}>
        <div className={styles.chartWrapper}>
          <ResponsiveContainer width={240} height={240}>
            <PieChart>
              <defs>
                {chartData.map((entry, index) => {
                  const gradient = getStatusGradient(entry.name)
                  return (
                    <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={gradient[0]} stopOpacity={1} />
                      <stop offset="100%" stopColor={gradient[1]} stopOpacity={1} />
                    </linearGradient>
                  )
                })}
              </defs>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(props) => <CustomLabel {...props} />}
                outerRadius={90}
                innerRadius={55}
                paddingAngle={3}
                dataKey="value"
                animationBegin={0}
                animationDuration={800}
                animationEasing="ease-out"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={`url(#gradient-${index})`}
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth={2}
                    style={{
                      filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
                    }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.legend}>
          {chartData.map((item, index) => {
            const colorScheme = COLOR_SCHEME[item.name] || {}
            return (
              <div 
                key={index} 
                className={styles.legendItem}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className={styles.legendIndicator}>
                  <div
                    className={styles.legendColor}
                    style={{ 
                      background: `linear-gradient(135deg, ${colorScheme.gradient?.[0] || '#B3D9FF'}, ${colorScheme.gradient?.[1] || '#99CCFF'})`,
                    }}
                  />
                </div>
                <div className={styles.legendContent}>
                  <span className={styles.legendLabel}>{item.name}</span>
                  <span className={styles.legendStats}>
                    <span className={styles.legendValue}>{item.value}</span>
                    <span className={styles.legendPercentage}>({item.percentage}%)</span>
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
