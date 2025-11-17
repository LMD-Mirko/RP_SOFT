import { Star, TrendingUp, Tags, Copy, Ellipsis, Eye, Pencil, Trash2 } from "lucide-react"
import { Button } from "./ui/Button"
import { Badge } from "./ui/Badge"
import { TemplateModal } from "./TemplateModal"
import { ConfirmModal } from "./ConfirmModal"
import styles from "../styles/TemplateCard.module.css"

import { useState } from "react"

export function TemplateCard({ tpl, onFavorite, onDuplicate, onDelete, onUpdate }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [showView, setShowView] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  return (
    <>
    <div className={styles.card}>
      <div className={styles.top}>
        <div className={styles.code}>{tpl.code}</div>
        <div className={styles.topActions}>
          <button
            className={`${styles.favoriteButton} ${tpl.favorito ? styles.favoriteActive : ''}`}
            title={tpl.favorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            onClick={onFavorite}
          >
            <Star size={18} className={styles.starIcon} />
          </button>
          <button
            className={styles.optionsButton}
            onClick={() => setMenuOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
          >
            <span className={styles.srOnly}>Opciones</span>
            <Ellipsis size={18} />
          </button>
          {menuOpen && (
            <div className={styles.menu} role="menu">
              <button className={styles.menuItem} onClick={() => { setShowView(true); setMenuOpen(false) }}>
                <Eye size={16} /> Ver Detalles
              </button>
              <button className={styles.menuItem} onClick={() => { setShowEdit(true); setMenuOpen(false) }}>
                <Pencil size={16} /> Editar
              </button>
              <button className={styles.menuItem} onClick={() => { onDuplicate(); setMenuOpen(false) }}>
                <Copy size={16} /> Duplicar
              </button>
              <button className={styles.menuItemDanger} onClick={() => { setShowDelete(true); setMenuOpen(false) }}>
                <Trash2 size={16} /> Eliminar
              </button>
            </div>
          )}
        </div>
      </div>

      <h3 className={styles.title}>{tpl.title}</h3>
      <p className={styles.desc}>{tpl.desc}</p>

      <div className={styles.tagWrap}>
        {tpl.tag && <Badge variant="info">{tpl.tag}</Badge>}
      </div>

      <div className={styles.footer}>
        <div className={styles.metrics}>
          <span className={styles.metric} title="Clones">
            <TrendingUp size={16} /> {tpl.clones}
          </span>
          <span className={styles.metric} title="Proyecto">
            <Tags size={16} /> {tpl.proyecto}
          </span>
        </div>
        <Button variant="light" className={styles.cloneButton} onClick={onDuplicate}>
          <Copy size={16} className={styles.iconLeft} /> Clonar
        </Button>
      </div>
    </div>
      <TemplateModal
        isOpen={showView}
        mode="view"
        tpl={tpl}
        onClose={() => setShowView(false)}
      />
      <TemplateModal
        isOpen={showEdit}
        mode="edit"
        tpl={tpl}
        onClose={() => setShowEdit(false)}
        onSave={(updates) => { onUpdate(updates); setShowEdit(false) }}
      />
      <ConfirmModal
        isOpen={showDelete}
        title="Eliminar plantilla"
        message="¿Estás seguro de eliminar esta plantilla? Esta acción no se puede deshacer."
        onCancel={() => setShowDelete(false)}
        onConfirm={() => { onDelete(); setShowDelete(false) }}
      />
    </>
  )
}
