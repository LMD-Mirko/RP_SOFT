import { Edit2, Trash2, Plus, CheckCircle2 } from 'lucide-react'
import styles from './PreguntaCard.module.css'
import clsx from 'clsx'

export function PreguntaCard({ pregunta, onEdit, onDelete, onAddOption, onEditOption, onDeleteOption, index = 0 }) {
  const options = pregunta.options || []

  return (
    <div className={styles.card} style={{ animationDelay: `${index * 0.1}s` }}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.orderBadge}>Pregunta {pregunta.order || index + 1}</span>
          <h3 className={styles.questionText}>{pregunta.text}</h3>
        </div>
        <div className={styles.actions}>
          <button onClick={() => onEdit(pregunta)} className={styles.actionButton} title="Editar pregunta">
            <Edit2 size={18} />
          </button>
          <button onClick={() => onDelete(pregunta)} className={clsx(styles.actionButton, styles.deleteButton)} title="Eliminar pregunta">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className={styles.optionsSection}>
        <div className={styles.optionsHeader}>
          <span className={styles.optionsLabel}>Opciones de Respuesta ({options.length})</span>
          <button onClick={() => onAddOption(pregunta)} className={styles.addOptionButton}>
            <Plus size={16} />
            Agregar Opción
          </button>
        </div>

        {options.length === 0 ? (
          <div className={styles.emptyOptions}>
            <p>No hay opciones configuradas. Agrega al menos 2 opciones.</p>
          </div>
        ) : (
          <div className={styles.optionsList}>
            {options
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((option, optIndex) => (
                <div key={option.id} className={styles.optionItem}>
                  <div className={styles.optionContent}>
                    <span className={styles.optionOrder}>{optIndex + 1}.</span>
                    <span className={styles.optionText}>{option.text}</span>
                    {option.is_correct && (
                      <span className={styles.correctBadge}>
                        <CheckCircle2 size={16} />
                        Correcta
                      </span>
                    )}
                  </div>
                  {(onEditOption || onDeleteOption) && (
                    <div className={styles.optionActions}>
                      {onEditOption && (
                        <button
                          onClick={() => onEditOption(pregunta, option)}
                          className={styles.optionActionButton}
                          title="Editar opción"
                        >
                          <Edit2 size={14} />
                        </button>
                      )}
                      {onDeleteOption && (
                        <button
                          onClick={() => onDeleteOption(pregunta, option)}
                          className={clsx(styles.optionActionButton, styles.optionActionButtonDelete)}
                          title="Eliminar opción"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}

