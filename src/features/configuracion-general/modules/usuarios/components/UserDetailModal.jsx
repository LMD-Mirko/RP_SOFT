import { User, Mail, Calendar, Shield, ShieldCheck, CheckCircle, XCircle } from 'lucide-react'
import { Modal } from '@shared/components/Modal'
import styles from './UserDetailModal.module.css'
import clsx from 'clsx'

export function UserDetailModal({ isOpen, onClose, user }) {
  if (!user) return null

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada'
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getRoleIcon = () => {
    return user.role_id === 2 ? ShieldCheck : User
  }

  const getRoleColor = () => {
    return user.role_id === 2 ? 'admin' : 'user'
  }

  const RoleIcon = getRoleIcon()

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalles del Usuario"
      size="md"
    >
      <div className={styles.content}>
        {/* Header con Avatar */}
        <div className={styles.header}>
          <div className={styles.avatar}>
            <User size={28} />
          </div>
          <div className={styles.headerInfo}>
            <h3 className={styles.nombre}>{user.fullName}</h3>
            <p className={styles.correo}>{user.email}</p>
          </div>
        </div>

        {/* Información Personal */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Información Personal</h4>
          <div className={styles.detailsGrid}>
            <div className={styles.detailRow}>
              <User size={16} className={styles.detailIcon} />
              <div>
                <span className={styles.detailLabel}>Nombre Completo</span>
                <p className={styles.detailValue}>{user.fullName}</p>
              </div>
            </div>

            <div className={styles.detailRow}>
              <Mail size={16} className={styles.detailIcon} />
              <div>
                <span className={styles.detailLabel}>Correo Electrónico</span>
                <p className={styles.detailValue}>{user.email}</p>
              </div>
            </div>

            <div className={styles.detailRow}>
              <User size={16} className={styles.detailIcon} />
              <div>
                <span className={styles.detailLabel}>Usuario</span>
                <p className={styles.detailValue}>{user.username || 'No especificado'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Información de Cuenta */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Información de Cuenta</h4>
          <div className={styles.processSection}>
            <div className={styles.processItem}>
              <RoleIcon size={16} className={clsx(styles.processIcon, styles[`icon_${getRoleColor()}`])} />
              <div className={styles.processContent}>
                <span className={styles.processLabel}>Rol</span>
                <span className={clsx(styles.badgeRole, styles[`badge_${getRoleColor()}`])}>
                  {user.role}
                </span>
              </div>
            </div>

            <div className={styles.processItem}>
              {user.is_active ? (
                <CheckCircle size={16} className={clsx(styles.processIcon, styles.icon_active)} />
              ) : (
                <XCircle size={16} className={clsx(styles.processIcon, styles.icon_inactive)} />
              )}
              <div className={styles.processContent}>
                <span className={styles.processLabel}>Estado</span>
                <span className={clsx(styles.badgeEstado, user.is_active ? styles.badge_active : styles.badge_inactive)}>
                  {user.is_active ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>

            <div className={styles.processItem}>
              <Shield size={16} className={styles.processIcon} />
              <div className={styles.processContent}>
                <span className={styles.processLabel}>Proveedor</span>
                <span className={styles.providerValue}>{user.provider || 'email'}</span>
              </div>
            </div>

            <div className={styles.processItem}>
              <Calendar size={16} className={styles.processIcon} />
              <div className={styles.processContent}>
                <span className={styles.processLabel}>Fecha de Registro</span>
                <span className={styles.fecha}>{formatDate(user.created_at)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones */}
        
      </div>
    </Modal>
  )
}

