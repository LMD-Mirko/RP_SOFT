import styles from '../../styles/Select.module.css'

export const Select = ({ className = '', children, ...props }) => (
  <select
    {...props}
    className={`${styles.select} ${className}`}
  >
    {children}
  </select>
)
