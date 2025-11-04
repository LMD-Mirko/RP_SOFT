import { forwardRef } from 'react'
import clsx from 'clsx'
import styles from './Textarea.module.css'

export const Textarea = forwardRef(({
  label,
  error,
  helperText,
  className,
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
      
      <textarea
        ref={ref}
        className={clsx(styles.textarea, error && styles.error)}
        {...props}
      />
      
      {helperText && (
        <span className={clsx(styles.helperText, error && styles.errorText)}>
          {helperText}
        </span>
      )}
    </div>
  )
})

Textarea.displayName = 'Textarea'

