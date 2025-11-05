import { ChevronLeft, Scale, ChevronUp } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import styles from './Sidebar.module.css'

export function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleNavigation = (path) => {
    navigate(path)
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <div className={styles.sidebar}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.logoContainer}>
          <div className={styles.logo}>
            RP
          </div>
          <span className={styles.logoText}>RP SOFT</span>
        </div>
        
        <button className={styles.backButton}>
          <ChevronLeft className="w-4 h-4" />
          <span>Volver al menú</span>
        </button>
      </div>

      {/* Navigation */}
      <div className={styles.navigation}>
        {/* Evaluaciones Section */}
        <div className={styles.section}>
          <button className={styles.sectionButton}>
            <div className={styles.sectionContent}>
              <Scale className="w-4 h-4" />
              <span>Evaluaciones</span>
            </div>
            <ChevronUp className="w-4 h-4" />
          </button>
          
          <div className={styles.menuItems}>
            <button 
              className={isActive('/evaluacion-360') ? styles.activeMenuItem : styles.menuItem}
              onClick={() => handleNavigation('/evaluacion-360')}
            >
              Eventos de Evaluación
            </button>
<<<<<<< HEAD
=======

>>>>>>> main
            <button 
              className={isActive('/evaluacion-360/evaluacion-360') ? styles.activeMenuItem : styles.menuItem}
              onClick={() => handleNavigation('/evaluacion-360/evaluacion-360')}
            >
              Evaluación 360°
            </button>
<<<<<<< HEAD
            <button className={styles.menuItem}>
              Evaluación Individual
            </button>
=======

            <button
  className={isActive('/evaluacion-360/evaluacion-tecnica') ? styles.activeMenuItem : styles.menuItem}
  onClick={() => handleNavigation('/evaluacion-360/evaluacion-tecnica')}
>
  Evaluación Técnica
</button>
>>>>>>> main
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className={styles.userProfile}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            JC
          </div>
          <div className={styles.userDetails}>
            <div className={styles.userName}>Jack Cruz</div>
            <div className={styles.userEmail}>jack.cruz12345@rpsoft.com</div>
          </div>
        </div>
        <div className={styles.userBadge}>
          <span className={styles.badge}>
            Estudiante
          </span>
        </div>
      </div>
    </div>
  )
<<<<<<< HEAD
}
=======
}
>>>>>>> main
