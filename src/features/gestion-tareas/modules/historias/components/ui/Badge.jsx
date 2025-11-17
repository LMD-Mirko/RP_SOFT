import styles from '../../styles/Badge.module.css'

export const Badge = ({ variant, children, className = '', ...props }) => {
  const variants = {
    info: styles.info,
  }
  const variantClass = variants[variant] || variants.info
  return (
    <span
      {...props}
      className={`${styles.badge} ${variantClass} ${className}`}
    >
      {children}
    </span>
  )
}
