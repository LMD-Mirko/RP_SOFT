import styles from './PanelCentralPage.module.css'
import { MeetingLibrary } from '../components/MeetingLibrary'

export function PanelCentralPage() {
  return (
    <div className={styles.container}>
      <div className={styles.headerSimple}>
        <div className={styles.title}>Panel Central</div>
        <div className={styles.subtitle}>Vista de transcripciones de proyectos y equipos</div>
      </div>

      <MeetingLibrary />
    </div>
  )
}