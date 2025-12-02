import { 
  PackageOpen,
  Activity, 
  FileText, 
  Users, 
  Search, 
  Calendar,
  AlertCircle,
  Database,
  FolderOpen,
  ClipboardList,
  BarChart3,
  MessageSquare,
} from 'lucide-react'
import styles from './EmptyState.module.css'

// Presets de iconos comunes
const ICON_PRESETS = {
  default: PackageOpen,
  activity: Activity,
  document: FileText,
  users: Users,
  search: Search,
  calendar: Calendar,
  alert: AlertCircle,
  database: Database,
  folder: FolderOpen,
  list: ClipboardList,
  chart: BarChart3,
  message: MessageSquare,
}

// Presets de colores
const COLOR_PRESETS = {
  default: {
    icon: '#9ca3af',
    background: 'rgba(156, 163, 175, 0.1)',
    border: 'rgba(156, 163, 175, 0.2)',
    glow: 'rgba(156, 163, 175, 0.35)',
  },
  blue: {
    icon: '#3b82f6',
    background: 'rgba(59, 130, 246, 0.1)',
    border: 'rgba(59, 130, 246, 0.2)',
    glow: 'rgba(59, 130, 246, 0.35)',
  },
  green: {
    icon: '#10b981',
    background: 'rgba(16, 185, 129, 0.1)',
    border: 'rgba(16, 185, 129, 0.2)',
    glow: 'rgba(16, 185, 129, 0.35)',
  },
  purple: {
    icon: '#8b5cf6',
    background: 'rgba(139, 92, 246, 0.1)',
    border: 'rgba(139, 92, 246, 0.2)',
    glow: 'rgba(139, 92, 246, 0.35)',
  },
  orange: {
    icon: '#f59e0b',
    background: 'rgba(245, 158, 11, 0.1)',
    border: 'rgba(245, 158, 11, 0.2)',
    glow: 'rgba(245, 158, 11, 0.35)',
  },
  turquoise: {
    icon: '#14b8a6',
    background: 'rgba(20, 184, 166, 0.1)',
    border: 'rgba(20, 184, 166, 0.2)',
    glow: 'rgba(20, 184, 166, 0.35)',
  },
  pink: {
    icon: '#ec4899',
    background: 'rgba(236, 72, 153, 0.1)',
    border: 'rgba(236, 72, 153, 0.2)',
    glow: 'rgba(236, 72, 153, 0.35)',
  },
  dark: {
    icon: '#0f172a',
    background: 'rgba(15, 23, 42, 0.08)',
    border: 'rgba(15, 23, 42, 0.25)',
    glow: 'rgba(15, 23, 42, 0.55)',
  },
}

/**
 * Componente EmptyState - Muestra un estado vacío cuando no hay datos
 * 
 * @param {Object} props
 * @param {string} props.title - Título principal (opcional)
 * @param {string} props.description - Descripción o mensaje (opcional)
 * @param {React.ComponentType|string} props.icon - Icono de Lucide o preset ('default', 'activity', 'document', etc.)
 * @param {string} props.iconPreset - Preset de icono ('default', 'activity', 'document', 'users', etc.)
 * @param {string} props.colorPreset - Preset de color ('default', 'blue', 'green', 'purple', 'orange', 'turquoise', 'pink')
 * @param {string} props.iconColor - Color personalizado para el icono
 * @param {string} props.glowColor - Color personalizado para el resplandor del icono
 * @param {string} props.background - Color de fondo personalizado
 * @param {string} props.border - Color de borde personalizado
 * @param {number} props.iconSize - Tamaño del icono (default: 64)
 * @param {React.ReactNode} props.children - Contenido adicional (botones, enlaces, etc.)
 * @param {string} props.className - Clase CSS adicional
 */
export function EmptyState({
  title,
  description,
  icon,
  iconPreset = 'default',
  colorPreset = 'default',
  iconColor,
  glowColor,
  background,
  border,
  iconSize = 64,
  children,
  className = '',
}) {
  // Determinar el icono a usar
  let IconComponent = null
  if (icon) {
    // Si es un componente de icono de Lucide, usarlo directamente
    if (typeof icon === 'function' || typeof icon === 'object') {
      IconComponent = icon
    } else if (ICON_PRESETS[icon]) {
      // Si es un string que coincide con un preset
      IconComponent = ICON_PRESETS[icon]
    }
  }
  
  // Si no se especificó icono, usar el preset
  if (!IconComponent) {
    IconComponent = ICON_PRESETS[iconPreset] || ICON_PRESETS.default
  }

  // Determinar los colores
  const colors = COLOR_PRESETS[colorPreset] || COLOR_PRESETS.default
  const finalIconColor = iconColor || '#0f172a'
  const finalBackground = background || colors.background
  const finalBorder = border || colors.border
  const finalGlow = glowColor || colors.glow || 'rgba(0, 0, 0, 0.3)'

  return (
    <div className={`${styles.container} ${className}`}>
      <div 
        className={styles.iconWrapper}
        style={{
          '--icon-color': finalIconColor,
          '--icon-background': finalBackground,
          '--icon-border': finalBorder,
          '--icon-glow': finalGlow,
        }}
      >
        <IconComponent size={iconSize} className={styles.icon} />
      </div>
      
      {title && (
        <h3 className={styles.title}>{title}</h3>
      )}
      
      {description && (
        <p className={styles.description}>{description}</p>
      )}
      
      {children && (
        <div className={styles.children}>
          {children}
        </div>
      )}
    </div>
  )
}

// Exportar los presets para uso externo
EmptyState.ICON_PRESETS = ICON_PRESETS
EmptyState.COLOR_PRESETS = COLOR_PRESETS

