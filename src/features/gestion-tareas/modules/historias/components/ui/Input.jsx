import styles from '../../styles/Input.module.css'

export const Input = ({ className = '', leftIcon = null, rightIcon = null, ...props }) => {
  if (leftIcon || rightIcon) {
    return (
      <div className={styles.inputWrapper}>
        {leftIcon && <span className={styles.iconLeft}>{leftIcon}</span>}
        <input
          {...props}
          className={`${styles.input} ${styles.inputHasIcons} ${className}`}
        />
        {rightIcon && <span className={styles.iconRight}>{rightIcon}</span>}
      </div>
    )
  }
  return (
    <input
      {...props}
      className={`${styles.input} ${className}`}
    />
  )
}
