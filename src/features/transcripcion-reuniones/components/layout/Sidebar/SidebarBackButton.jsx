import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import styles from './SidebarBackButton.module.css'

export function SidebarBackButton() {
  const navigate = useNavigate()

  const handleBackToMain = () => {
    navigate('/')
  }

  return (
    <div className={styles.backButtonContainer}>
      <button onClick={handleBackToMain} className={styles.backButton}>
        <ArrowLeft size={16} />
        <span>Volver al menú general</span>
      </button>
    </div>
  )
}