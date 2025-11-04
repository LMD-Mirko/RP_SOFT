import { forwardRef } from 'react'
import clsx from 'clsx'
import styles from './Button.module.css'

export const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  className,
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      className={clsx(
        styles.button,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        loading && styles.loading,
        className
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <div className={styles.spinner} />}
      {!loading && Icon && iconPosition === 'left' && <Icon size={18} className={styles.iconLeft} />}
      <span>{children}</span>
      {!loading && Icon && iconPosition === 'right' && <Icon size={18} className={styles.iconRight} />}
    </button>
  )
})

Button.displayName = 'Button'

