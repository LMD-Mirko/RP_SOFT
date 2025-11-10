import React, { useState, useRef, useEffect } from 'react'
import clsx from 'clsx'
import { Menu, Search } from 'lucide-react'
import styles from './ChatSidebar.module.css'

export function ChatSidebar({ isCollapsed, onToggle }) {
  const recentItems = [
    'Busqueda de un seleccionado...',
    'Busqueda de una reunion...',
    'Registro de una tarea...',
    'Quien ingreso tarde hoy...',
    'Dime quien tiene una nota mayor a 18..',
    'Que convenio debo de firmar hoy...',
    'Que practicante tiene una nota no aprobo este mes...',
    'Registra a este nuevo postulante...',
    'Dime de que trato la reunion de las 9:00..',
    'Pon en tardanza a este practicante...',
    'Dime que constancia debo de firmar hoy...',
    'Cuando falta Luiz Fernandez...'
  ]

  const [searchOpen, setSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const searchInputRef = useRef(null)

  useEffect(() => {
    if (searchOpen) {
      requestAnimationFrame(() => {
        searchInputRef.current?.focus()
      })
    } else {
      setSearchTerm('')
    }
  }, [searchOpen])

  useEffect(() => {
    if (isCollapsed) {
      setSearchOpen(false)
    }
  }, [isCollapsed])

  const filteredItems = recentItems.filter((item) =>
    item.toLowerCase().includes(searchTerm.trim().toLowerCase())
  )

  const handleSearchToggle = () => {
    setSearchOpen((prev) => !prev)
  }

  return (
    <div
      className={clsx(styles.chatSidebar, isCollapsed && styles.chatSidebarCollapsed)}
    >
      <div className={styles.sidebarHeader}>
        <button
          className={styles.iconButton}
          aria-label={isCollapsed ? 'Expandir panel lateral' : 'Contraer panel lateral'}
          onClick={onToggle}
        >
          <Menu size={20} />
        </button>
        <div className={styles.headerActions}>
          {!isCollapsed && (
            <button
              className={styles.iconButton}
              aria-label={searchOpen ? 'Cerrar búsqueda' : 'Buscar en recientes'}
              onClick={handleSearchToggle}
            >
              <Search size={20} />
            </button>
          )}
        </div>
      </div>

      {!isCollapsed && searchOpen && (
        <div className={styles.searchBar}>
          <input
            ref={searchInputRef}
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar en recientes..."
            className={styles.searchInput}
            aria-label="Buscar nombre de conversación reciente"
          />
        </div>
      )}

      {!isCollapsed && (
        <div className={styles.sidebarContent}>
          <div className={styles.recentSection}>
            <h3 className={styles.sectionTitle}>Reciente</h3>
            <div className={styles.recentList}>
              {filteredItems.length > 0 ? (
                filteredItems.map((item, i) => (
                  <div key={i} className={styles.recentItem}>
                    {item}
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>Sin coincidencias</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
