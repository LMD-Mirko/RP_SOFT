import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'
import { Menu, Search, MoreVertical, Edit, Trash2 } from 'lucide-react'
import styles from './ChatSidebar.module.css'

export function ChatSidebar({ isCollapsed, onToggle, onSelectChat }) {
  const initialItems = [
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

  const [recentItems, setRecentItems] = useState(initialItems)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [openMenuIndex, setOpenMenuIndex] = useState(null)
  const [editingIndex, setEditingIndex] = useState(null)
  const [editingValue, setEditingValue] = useState('')
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 })
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteIndex, setDeleteIndex] = useState(null)
  const menuRef = useRef(null)
  const buttonRefs = useRef({})
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
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuIndex(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuRef])

  useEffect(() => {
    if (isCollapsed) {
      setSearchOpen(false)
    }
  }, [isCollapsed])

  useEffect(() => {
    if (openMenuIndex !== null) {
      const updateMenuPosition = () => {
        const button = buttonRefs.current[openMenuIndex]
        if (button) {
          const rect = button.getBoundingClientRect()
          setMenuPosition({
            top: rect.top + rect.height / 2,
            right: window.innerWidth - rect.left + 8
          })
        }
      }

      updateMenuPosition()
      window.addEventListener('scroll', updateMenuPosition, true)
      window.addEventListener('resize', updateMenuPosition)

      return () => {
        window.removeEventListener('scroll', updateMenuPosition, true)
        window.removeEventListener('resize', updateMenuPosition)
      }
    }
  }, [openMenuIndex])

  const handleMoreClick = (event, index) => {
    event.stopPropagation()
    if (openMenuIndex === index) {
      setOpenMenuIndex(null)
    } else {
      const button = buttonRefs.current[index]
      if (button) {
        const rect = button.getBoundingClientRect()
        setMenuPosition({
          top: rect.top + rect.height / 2,
          right: window.innerWidth - rect.left + 8
        })
      }
      setOpenMenuIndex(index)
    }
  }

  const handleDelete = (event, index) => {
    event.stopPropagation()
    setDeleteIndex(index)
    setShowDeleteModal(true)
    setOpenMenuIndex(null)
  }

  const confirmDelete = () => {
    if (deleteIndex !== null) {
      setRecentItems(prev => prev.filter((_, i) => i !== deleteIndex))
      setDeleteIndex(null)
    }
    setShowDeleteModal(false)
  }

  const cancelDelete = () => {
    setShowDeleteModal(false)
    setDeleteIndex(null)
  }

  const handleRename = (event, index) => {
    event.stopPropagation()
    setEditingIndex(index)
    setEditingValue(recentItems[index])
    setOpenMenuIndex(null)
  }

  const handleRenameChange = (event) => {
    setEditingValue(event.target.value)
  }

  const handleRenameSubmit = (event, index) => {
    event.preventDefault()
    if (editingValue.trim() !== '') {
      setRecentItems(prev => prev.map((item, i) => (i === index ? editingValue : item)))
    }
    setEditingIndex(null)
  }

  const handleRenameBlur = () => {
    setEditingIndex(null)
  }

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
                  <div
                    key={i}
                    className={styles.recentItem}
                    onClick={() => editingIndex !== i && onSelectChat?.(item)}
                  >
                    {editingIndex !== i && (
                      <div className={styles.moreContainer}>
                        <button
                          ref={(el) => { buttonRefs.current[i] = el }}
                          className={styles.moreButton}
                          onClick={(e) => handleMoreClick(e, i)}
                        >
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    )}
                    {editingIndex === i ? (
                      <form onSubmit={(e) => handleRenameSubmit(e, i)} className={styles.renameForm}>
                        <input
                          type="text"
                          value={editingValue}
                          onChange={handleRenameChange}
                          onBlur={handleRenameBlur}
                          autoFocus
                          className={styles.renameInput}
                        />
                      </form>
                    ) : (
                      <span className={styles.recentItemText}>{item}</span>
                    )}
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>Sin coincidencias</div>
              )}
            </div>
          </div>
        </div>
      )}
      {openMenuIndex !== null && (
        <div
          ref={menuRef}
          className={styles.contextMenu}
          style={{
            top: `${menuPosition.top}px`,
            right: `${menuPosition.right}px`,
            transform: 'translateY(-50%)'
          }}
        >
          <div className={styles.contextMenuItem} onClick={(e) => handleRename(e, openMenuIndex)}>
            <Edit size={14} className={styles.menuIcon} />
            <span>Cambiar nombre</span>
          </div>
          <div className={`${styles.contextMenuItem} ${styles.deleteOption}`} onClick={(e) => handleDelete(e, openMenuIndex)}>
            <Trash2 size={14} className={styles.menuIcon} />
            <span>Eliminar</span>
          </div>
        </div>
      )}
      {showDeleteModal && createPortal(
        <div className={styles.modalOverlay} onClick={cancelDelete}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>¿Deseas eliminar el chat?</h3>
            <p className={styles.modalMessage}>
              Esto eliminará <strong>{deleteIndex !== null ? recentItems[deleteIndex] : ''}</strong>.
            </p>
            <p className={styles.modalSubtext}>
              Ve a Configuración para eliminar todas las memorias guardadas durante este chat.
            </p>
            <div className={styles.modalButtons}>
              <button className={styles.cancelButton} onClick={cancelDelete}>
                Cancelar
              </button>
              <button className={styles.deleteButton} onClick={confirmDelete}>
                Eliminar
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
