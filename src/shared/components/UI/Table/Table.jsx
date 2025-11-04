import { forwardRef } from 'react'
import clsx from 'clsx'
import styles from './Table.module.css'

export const Table = forwardRef(({ children, className, striped = false, hover = true, bordered = false }, ref) => {
  return (
    <div className={styles.tableWrapper}>
      <table
        ref={ref}
        className={clsx(
          styles.table,
          striped && styles.striped,
          hover && styles.hover,
          bordered && styles.bordered,
          className
        )}
      >
        {children}
      </table>
    </div>
  )
})

Table.displayName = 'Table'

// Subcomponente Header
Table.Header = function TableHeader({ children, className }) {
  return (
    <thead className={clsx(styles.header, className)}>
      {children}
    </thead>
  )
}

// Subcomponente Body
Table.Body = function TableBody({ children, className }) {
  return (
    <tbody className={clsx(styles.body, className)}>
      {children}
    </tbody>
  )
}

// Subcomponente Row
Table.Row = function TableRow({ children, className, onClick, hover = true }) {
  return (
    <tr
      className={clsx(
        styles.row,
        onClick && styles.clickable,
        hover && styles.rowHover,
        className
      )}
      onClick={onClick}
    >
      {children}
    </tr>
  )
}

// Subcomponente HeaderCell
Table.HeaderCell = function TableHeaderCell({ children, className, align = 'left', width }) {
  return (
    <th
      className={clsx(styles.headerCell, styles[`align_${align}`], className)}
      style={{ width }}
    >
      {children}
    </th>
  )
}

// Subcomponente Cell
Table.Cell = function TableCell({ children, className, align = 'left', width }) {
  return (
    <td
      className={clsx(styles.cell, styles[`align_${align}`], className)}
      style={{ width }}
    >
      {children}
    </td>
  )
}

// Subcomponente Empty (estado vacío)
Table.Empty = function TableEmpty({ children, colSpan, icon: Icon }) {
  return (
    <tr>
      <td colSpan={colSpan} className={styles.empty}>
        {Icon && <Icon size={48} className={styles.emptyIcon} />}
        <div className={styles.emptyText}>{children}</div>
      </td>
    </tr>
  )
}

