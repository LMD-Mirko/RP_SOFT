import { X, Eye, Pencil, Save, Tag, FolderOpen } from 'lucide-react'
import { useState, useEffect } from 'react'
import styles from '../styles/TemplateModal.module.css'
import { Input } from './ui/Input'
import { Select } from './ui/Select'
import { Button } from './ui/Button'

export function TemplateModal({ isOpen, onClose, tpl, mode = 'view', onSave }) {
  const [form, setForm] = useState({ title: '', desc: '', tag: '', proyecto: '' })

  useEffect(() => {
    if (tpl && isOpen) {
      setForm({
        title: tpl.title || '',
        desc: tpl.desc || '',
        tag: tpl.tag || '',
        proyecto: tpl.proyecto || '',
      })
    }
  }, [tpl, isOpen])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  if (!isOpen) return null

  const categorias = [
    'Autenticación', 'CRUD', 'Interfaz de Usuario', 'Integración API', 'Reportes', 'Notificaciones'
  ]
  const proyectos = [
    'PB-M1 (Autenticación)', 'PB-M2 (Usuarios)', 'PB-M3 (Dashboard)', 'PB-M4 (Reportes)', 'PB-M5 (API)'
  ]

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} role="dialog" aria-modal="true">
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            {mode === 'view' ? <Eye size={18} /> : <Pencil size={18} />}
            <h3 className={styles.title}>{mode === 'view' ? 'Detalles de Plantilla' : 'Editar Plantilla'}</h3>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">
            <X size={18} />
          </button>
        </div>

        <div className={styles.content}>
          {mode === 'view' ? (
            <div className={styles.viewGrid}>
              <div className={styles.row}><span className={styles.label}>Código</span><span className={styles.value}>{tpl.code}</span></div>
              <div className={styles.row}><span className={styles.label}>Título</span><span className={styles.value}>{tpl.title}</span></div>
              <div className={styles.row}><span className={styles.label}>Descripción</span><span className={styles.value}>{tpl.desc}</span></div>
              <div className={styles.row}><span className={styles.label}>Categoría</span><span className={styles.value}>{tpl.tag}</span></div>
              <div className={styles.row}><span className={styles.label}>Proyecto</span><span className={styles.value}>{tpl.proyecto}</span></div>
              <div className={styles.row}><span className={styles.label}>Clones</span><span className={styles.value}>{tpl.clones}</span></div>
            </div>
          ) : (
            <form
              className={styles.form}
              onSubmit={(e) => {
                e.preventDefault()
                onSave && onSave(form)
              }}
            >
              <Input
                placeholder="Título"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <Input
                placeholder="Descripción"
                value={form.desc}
                onChange={(e) => setForm({ ...form, desc: e.target.value })}
              />
              <div className={styles.formRow}>
                <div className={styles.selectWrap}>
                  <span className={styles.selectIcon}><Tag size={16} /></span>
                  <Select
                    value={form.tag}
                    onChange={(e) => setForm({ ...form, tag: e.target.value })}
                  >
                    {categorias.map((c) => (<option key={c}>{c}</option>))}
                  </Select>
                </div>
                <div className={styles.selectWrap}>
                  <span className={styles.selectIcon}><FolderOpen size={16} /></span>
                  <Select
                    value={form.proyecto}
                    onChange={(e) => setForm({ ...form, proyecto: e.target.value })}
                  >
                    {proyectos.map((p) => (<option key={p}>{p}</option>))}
                  </Select>
                </div>
              </div>
              <div className={styles.actions}>
                <Button variant="light" type="button" onClick={onClose}>Cancelar</Button>
                <Button variant="dark" type="submit"><Save size={16} className={styles.iconLeft} /> Guardar</Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}