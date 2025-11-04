import { forwardRef } from 'react'
import clsx from 'clsx'
import styles from './Input.module.css'

export const Input = forwardRef(({
  label,
  error,
  helperText,
  className,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = true,
  ...props
}, ref) => {
  return (
    <div className={clsx(styles.container, fullWidth && styles.fullWidth, className)}>
      {label && (
        <label className={styles.label} htmlFor={props.id}>
          {label}
          {props.required && <span className={styles.required}>*</span>}
        </label>
      )}
      
      <div className={styles.inputWrapper}>
        {Icon && iconPosition === 'left' && (
          <div className={styles.iconLeft}>
            <Icon size={18} />
          </div>
        )}
        
        <input
          ref={ref}
          className={clsx(
            styles.input,
            error && styles.error,
            Icon && iconPosition === 'left' && styles.hasIconLeft,
            Icon && iconPosition === 'right' && styles.hasIconRight,
          )}
          {...props}
        />
        
        {Icon && iconPosition === 'right' && (
          <div className={styles.iconRight}>
            <Icon size={18} />
          </div>
        )}
      </div>
      
      {helperText && (
        <span className={clsx(styles.helperText, error && styles.errorText)}>
          {helperText}
        </span>
      )}
    </div>
  )
})

Input.displayName = 'Input'

