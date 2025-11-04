import { Select } from '@shared/components/Select'
import styles from './ActivityFilter.module.css'

const filterOptions = [
  { value: 'all', label: 'Todos los tipos' },
  { value: 'creacion', label: 'Creación' },
  { value: 'cambio', label: 'Cambios' },
  { value: 'evaluacion', label: 'Evaluaciones' },
  { value: 'rechazo', label: 'Rechazos' },
]

export function ActivityFilter({ value, onChange }) {
  return (
    <div className={styles.container}>
      <Select
        id="activityFilter"
        name="activityFilter"
        value={value}
        onChange={onChange}
        options={filterOptions}
        placeholder="Todos los tipos"
      />
    </div>
  )
}


