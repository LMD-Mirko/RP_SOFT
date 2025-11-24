import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useMemo } from 'react'
import { EmptyState } from '@shared/components/EmptyState'
import styles from './ConvocatoriasStatusChart.module.css'

const COLOR_SCHEME = {
  'abierta': {
    gradient: ['#B3FFD9', '#99FFCC'],
    solid: '#B3FFD9',
    light: '#f3f4f6',
    shadow: 'rgba(179, 255, 217, 0.4)',
  },
  'cerrada': {
    gradient: ['#FFF4B3', '#FFE699'],
    solid: '#FFF4B3',
    light: '#f9fafb',
    shadow: 'rgba(255, 244, 179, 0.3)',
  },
}

const getStatusColor = (status) => {
  return COLOR_SCHEME[status]?.solid || '#B3D9FF'
}

const getStatusGradient = (status) => {
  return COLOR_SCHEME[status]?.gradient || ['#B3D9FF', '#99CCFF']
}

const getStatusShadow = (status) => {
  return COLOR_SCHEME[status]?.shadow || 'rgba(179, 217, 255, 0.4)'
}

const getStatusLabel = (status) => {
  const labels = {
    'abierta': 'Abierta',
    'cerrada': 'Cerrada',
  }
  return labels[status] || status
}

export function ConvocatoriasStatusChart({ data = [] }) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return []
    return data.map((item) => ({
      name: getStatusLabel(item.status),
      status: item.status,
      value: item.count,
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
          <h3 className={styles.title}>Estados de Convocatorias</h3>
          <div className={styles.badge}>{total}</div>
        </div>
        <EmptyState
          iconPreset="folder"
          colorPreset="dark"
          iconColor="#0f172a"
          title="No hay datos disponibles"
          description="Cuando existan convocatorias registradas verás su estado aquí."
          className={styles.emptyState}
        />
      </div>
    )
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      const status = data.payload.status
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
              <span className={styles.tooltipUnit}> convocatorias</span>
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
          <h3 className={styles.title}>Estados de Convocatorias</h3>
          <p className={styles.subtitle}>Distribución por estado</p>
        </div>
        <div className={styles.badge}>
          <span className={styles.badgeNumber}>{total}</span>
          <span className={styles.badgeLabel}>Total</span>
        </div>
      </div>
      
      <div className={styles.chartContent}>
        <div className={styles.chartWrapper}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData} 
              margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
              barCategoryGap="30%"
            >
              <defs>
                {chartData.map((entry, index) => {
                  const gradient = getStatusGradient(entry.status)
                  return (
                    <linearGradient key={`barGradient-${index}`} id={`barGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={gradient[0]} stopOpacity={1} />
                      <stop offset="100%" stopColor={gradient[1]} stopOpacity={1} />
                    </linearGradient>
                  )
                })}
              </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke="rgba(0, 0, 0, 0.05)"
              strokeWidth={1}
            />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 600 }}
              axisLine={{ stroke: 'rgba(0, 0, 0, 0.08)', strokeWidth: 1 }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              width={35}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.02)' }} />
              <Bar 
                dataKey="value" 
                radius={[8, 8, 0, 0]}
                animationBegin={0}
                animationDuration={800}
                animationEasing="ease-out"
              >
                {chartData.map((entry, index) => {
                  const shadow = getStatusShadow(entry.status)
                  return (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={`url(#barGradient-${index})`}
                      style={{
                        filter: `drop-shadow(0 4px 8px ${shadow})`,
                      }}
                    />
                  )
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.summary}>
          {chartData.map((item, index) => {
            const colorScheme = COLOR_SCHEME[item.status] || {}
            const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0
            
            return (
              <div 
                key={index} 
                className={styles.summaryItem}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className={styles.summaryIndicator}>
                  <div
                    className={styles.summaryColor}
                    style={{ 
                      background: `linear-gradient(135deg, ${colorScheme.gradient?.[0] || '#6b7280'}, ${colorScheme.gradient?.[1] || '#4b5563'})`,
                    }}
                  />
                </div>
                <div className={styles.summaryContent}>
                  <span className={styles.summaryLabel}>{item.name}</span>
                  <span className={styles.summaryStats}>
                    <span className={styles.summaryValue}>{item.value}</span>
                    <span className={styles.summaryPercentage}>({percentage}%)</span>
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
