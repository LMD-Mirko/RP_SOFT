import styles from '../../styles/Button.module.css'

export const Button = ({ variant, children, className = '', ...props }) => {
  const variants = {
    light: styles.light,
    dark: styles.dark,
  }
  const variantClass = variants[variant] || variants.light
  return (
    <button
      {...props}
      className={`${styles.button} ${variantClass} ${className}`}
    >
      {children}
    </button>
  )
}
