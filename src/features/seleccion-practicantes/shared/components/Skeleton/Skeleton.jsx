import clsx from 'clsx'
import styles from './Skeleton.module.css'

/**
 * Componente base Skeleton - Crea un placeholder animado
 */
export function Skeleton({ 
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
  className,
  style,
  ...props 
}) {
  return (
    <div
      className={clsx(
        styles.skeleton,
        styles[variant],
        styles[animation],
        className
      )}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        ...style
      }}
      {...props}
    />
  )
}

/**
 * Skeleton para tarjetas de estadísticas
 */
export function SkeletonStatsCard({ index = 0 }) {
  return (
    <div 
      className={styles.statsCard}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className={styles.statsCardContent}>
        <Skeleton variant="rectangular" height={32} width="60%" />
        <Skeleton variant="text" width="80%" height={20} />
        <Skeleton variant="text" width="50%" height={16} />
      </div>
      <Skeleton variant="circular" width={56} height={56} />
    </div>
  )
}

/**
 * Skeleton para tarjetas de convocatorias
 */
export function SkeletonConvocatoriaCard({ index = 0 }) {
  return (
    <div 
      className={styles.convocatoriaCard}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className={styles.convocatoriaHeader}>
        <Skeleton variant="text" width="70%" height={24} />
        <Skeleton variant="rectangular" width={80} height={24} />
      </div>
      <Skeleton variant="text" width="100%" height={16} />
      <Skeleton variant="text" width="90%" height={16} />
      <div className={styles.convocatoriaDivider}></div>
      <div className={styles.convocatoriaGrid}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={styles.convocatoriaInfo}>
            <Skeleton variant="text" width="60%" height={12} />
            <Skeleton variant="text" width="80%" height={16} />
          </div>
        ))}
      </div>
      <div className={styles.convocatoriaActions}>
        <Skeleton variant="rectangular" width={100} height={36} />
        <Skeleton variant="rectangular" width={120} height={36} />
      </div>
    </div>
  )
}

/**
 * Skeleton para listas
 */
export function SkeletonList({ items = 3 }) {
  return (
    <div className={styles.list}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className={styles.listItem}>
          <Skeleton variant="circular" width={40} height={40} />
          <div className={styles.listContent}>
            <Skeleton variant="text" width="70%" height={18} />
            <Skeleton variant="text" width="50%" height={14} />
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Skeleton para tablas
 */
export function SkeletonTable({ rows = 5, columns = 4 }) {
  return (
    <div className={styles.table}>
      {/* Header */}
      <div className={styles.tableRow}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} variant="rectangular" height={40} />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={styles.tableRow}>
          {Array.from({ length: columns }).map((_, j) => (
            <Skeleton key={j} variant="rectangular" height={60} />
          ))}
        </div>
      ))}
    </div>
  )
}

/**
 * Skeleton para gráficos/charts
 */
export function SkeletonChart({ height = 300 }) {
  return (
    <div className={styles.chart} style={{ height: `${height}px` }}>
      <div className={styles.chartHeader}>
        <Skeleton variant="text" width="40%" height={20} />
        <Skeleton variant="text" width="20%" height={16} />
      </div>
      <div className={styles.chartContent}>
        <Skeleton variant="rectangular" width="100%" height="80%" />
      </div>
    </div>
  )
}


