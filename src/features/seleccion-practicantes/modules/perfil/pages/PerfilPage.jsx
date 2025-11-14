import { useState, useEffect } from 'react'
import { User, Mail, Lock, Save, Camera, Shield, CheckCircle, AlertCircle, Eye, EyeOff, Calendar, MapPin, Phone, CreditCard, Globe, Info } from 'lucide-react'
import { Input } from '@shared/components/Input'
import { Button } from '@shared/components/Button'
import { useProfile } from '../hooks/useProfile'
import { ConfirmModal } from '@shared/components/ConfirmModal'
import { PhotoUploadModal } from '../components/PhotoUploadModal'
import styles from './PerfilPage.module.css'

export function PerfilPage() {
  const { profile, loading, loadProfile, updateProfile, changePassword, uploadPhoto, profileImageUrl } = useProfile()
  const [formData, setFormData] = useState({
    name: '',
    paternal_lastname: '',
    maternal_lastname: '',
    email: '',
    username: '',
  })
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  })
  const [errors, setErrors] = useState({})
  const [passwordErrors, setPasswordErrors] = useState({})
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  })

  useEffect(() => {
    loadProfile()
  }, [])

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        paternal_lastname: profile.paternal_lastname || '',
        maternal_lastname: profile.maternal_lastname || '',
        email: profile.email || '',
        username: profile.username || '',
      })
    }
  }, [profile])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({ ...prev, [name]: value }))
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const validateProfile = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido'
    if (!formData.paternal_lastname.trim()) newErrors.paternal_lastname = 'El apellido paterno es requerido'
    if (!formData.email.trim()) newErrors.email = 'El email es requerido'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validatePassword = () => {
    const newErrors = {}
    if (!passwordData.old_password) newErrors.old_password = 'La contraseña actual es requerida'
    if (!passwordData.new_password) newErrors.new_password = 'La nueva contraseña es requerida'
    else if (passwordData.new_password.length < 8) {
      newErrors.new_password = 'La contraseña debe tener al menos 8 caracteres'
    }
    if (!passwordData.confirm_password) newErrors.confirm_password = 'Confirma la nueva contraseña'
    else if (passwordData.new_password !== passwordData.confirm_password) {
      newErrors.confirm_password = 'Las contraseñas no coinciden'
    }
    setPasswordErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    if (!validateProfile()) return

    try {
      await updateProfile({
        name: formData.name,
        paternal_lastname: formData.paternal_lastname,
        maternal_lastname: formData.maternal_lastname,
        email: formData.email,
      })
    } catch (error) {
      // El error ya se maneja en el hook
    }
  }

  const handleChangePassword = async () => {
    if (!validatePassword()) return

    try {
      await changePassword(passwordData.old_password, passwordData.new_password)
      setIsPasswordModalOpen(false)
      setPasswordData({
        old_password: '',
        new_password: '',
        confirm_password: '',
      })
    } catch (error) {
      // El error ya se maneja en el hook
    }
  }

  const handleUploadPhoto = async (file) => {
    setUploadingPhoto(true)
    try {
      await uploadPhoto(file)
      setIsPhotoModalOpen(false)
    } catch (error) {
      // El error ya se maneja en el hook
    } finally {
      setUploadingPhoto(false)
    }
  }

  if (loading && !profile) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          <p>Cargando perfil...</p>
        </div>
      </div>
    )
  }

  const fullName = profile
    ? `${profile.name || ''} ${profile.paternal_lastname || ''} ${profile.maternal_lastname || ''}`.trim() || 'Usuario'
    : 'Usuario'

  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible'
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        {/* Left Column - Profile Card */}
        <div className={styles.leftColumn}>
          <div className={styles.profileCard}>
            <div className={styles.profileHeader}>
              <div className={styles.avatarWrapper}>
                <div className={styles.avatarContainer}>
                  {profileImageUrl ? (
                    <img src={profileImageUrl} alt={fullName} className={styles.avatarImage} />
                  ) : (
                    <div className={styles.avatarPlaceholder}>
                      <User size={48} />
                    </div>
                  )}
                  <button
                    className={styles.editPhotoButton}
                    onClick={() => setIsPhotoModalOpen(true)}
                    title="Cambiar foto de perfil"
                    disabled={uploadingPhoto}
                  >
                    <Camera size={16} />
                  </button>
                  {uploadingPhoto && (
                    <div className={styles.uploadingBadge}>
                      <div className={styles.uploadingSpinner}></div>
                    </div>
                  )}
                </div>
              </div>
              <h1 className={styles.profileName}>{fullName}</h1>
              <p className={styles.profileEmail}>{profile?.email || ''}</p>
            </div>

            <div className={styles.profileInfo}>
              <div className={styles.infoSection}>
                <h3 className={styles.infoTitle}>Información de Cuenta</h3>
                <div className={styles.infoList}>
                  <div className={styles.infoItem}>
                    <User size={18} className={styles.infoIcon} />
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>Usuario</span>
                      <span className={styles.infoValue}>@{profile?.username || 'usuario'}</span>
                    </div>
                  </div>
                  {profile?.role_id && (
                    <div className={styles.infoItem}>
                      <Shield size={18} className={styles.infoIcon} />
                      <div className={styles.infoContent}>
                        <span className={styles.infoLabel}>Rol</span>
                        <span className={styles.infoValue}>
                          {profile.role_id === 2 ? 'Administrador' : profile.role_id === 1 ? 'Postulante' : 'Usuario'}
                        </span>
                      </div>
                    </div>
                  )}
                  {profile?.provider && (
                    <div className={styles.infoItem}>
                      <Globe size={18} className={styles.infoIcon} />
                      <div className={styles.infoContent}>
                        <span className={styles.infoLabel}>Proveedor</span>
                        <span className={styles.infoValue} style={{ textTransform: 'capitalize' }}>
                          {profile.provider}
                        </span>
                      </div>
                    </div>
                  )}
                  {profile?.account_status && (
                    <div className={styles.infoItem}>
                      <AlertCircle size={18} className={styles.infoIcon} />
                      <div className={styles.infoContent}>
                        <span className={styles.infoLabel}>Estado de Cuenta</span>
                        <span className={`${styles.infoValue} ${styles.statusBadge} ${styles[profile.account_status]}`}>
                          {profile.account_status === 'pending_verification' ? 'Pendiente de Verificación' :
                           profile.account_status === 'active' ? 'Activo' :
                           profile.account_status === 'inactive' ? 'Inactivo' :
                           profile.account_status}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className={styles.infoItem}>
                    <CheckCircle size={18} className={styles.infoIcon} />
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>Email Verificado</span>
                      <span className={`${styles.infoValue} ${profile?.is_email_verified ? styles.verified : styles.notVerified}`}>
                        {profile?.is_email_verified ? 'Sí' : 'No'}
                      </span>
                    </div>
                  </div>
                  {profile?.created_at && (
                    <div className={styles.infoItem}>
                      <Calendar size={18} className={styles.infoIcon} />
                      <div className={styles.infoContent}>
                        <span className={styles.infoLabel}>Miembro desde</span>
                        <span className={styles.infoValue}>{formatDate(profile.created_at)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {(profile?.document_type_name || profile?.document_number || profile?.phone || profile?.country_name || profile?.region_name || profile?.province_name || profile?.district_name) && (
                <div className={styles.infoSection}>
                  <h3 className={styles.infoTitle}>Información Personal</h3>
                  <div className={styles.infoList}>
                    {profile?.document_type_name && profile?.document_number && (
                      <div className={styles.infoItem}>
                        <CreditCard size={18} className={styles.infoIcon} />
                        <div className={styles.infoContent}>
                          <span className={styles.infoLabel}>{profile.document_type_name}</span>
                          <span className={styles.infoValue}>{profile.document_number}</span>
                        </div>
                      </div>
                    )}
                    {profile?.phone && (
                      <div className={styles.infoItem}>
                        <Phone size={18} className={styles.infoIcon} />
                        <div className={styles.infoContent}>
                          <span className={styles.infoLabel}>Teléfono</span>
                          <span className={styles.infoValue}>{profile.phone}</span>
                        </div>
                      </div>
                    )}
                    {(profile?.country_name || profile?.region_name || profile?.province_name || profile?.district_name) && (
                      <div className={styles.infoItem}>
                        <MapPin size={18} className={styles.infoIcon} />
                        <div className={styles.infoContent}>
                          <span className={styles.infoLabel}>Ubicación</span>
                          <span className={styles.infoValue}>
                            {[
                              profile.district_name,
                              profile.province_name,
                              profile.region_name,
                              profile.country_name
                            ].filter(Boolean).join(', ') || 'No especificada'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Forms */}
        <div className={styles.rightColumn}>
          {/* Información Personal Card */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardHeaderLeft}>
                <div className={styles.cardIcon}>
                  <User size={20} />
                </div>
                <div>
                  <h2 className={styles.cardTitle}>Información Personal</h2>
                  <p className={styles.cardDescription}>
                    Actualiza tu información personal y de contacto
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className={styles.form}>
              <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>Datos Personales</h3>
                <div className={styles.formGrid}>
                  <div className={styles.inputWrapper}>
                    <Input
                      label="Nombre"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      icon={User}
                      iconPosition="left"
                      error={errors.name}
                      required
                    />
                  </div>
                  <div className={styles.inputWrapper}>
                    <Input
                      label="Apellido Paterno"
                      id="paternal_lastname"
                      name="paternal_lastname"
                      value={formData.paternal_lastname}
                      onChange={handleChange}
                      icon={User}
                      iconPosition="left"
                      error={errors.paternal_lastname}
                      required
                    />
                  </div>
                  <div className={styles.inputWrapper}>
                    <Input
                      label="Apellido Materno"
                      id="maternal_lastname"
                      name="maternal_lastname"
                      value={formData.maternal_lastname}
                      onChange={handleChange}
                      icon={User}
                      iconPosition="left"
                      error={errors.maternal_lastname}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>Información de Contacto</h3>
                <div className={styles.formGrid}>
                  <div className={styles.inputWrapper}>
                    <Input
                      label="Email"
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      icon={Mail}
                      iconPosition="left"
                      error={errors.email}
                      required
                    />
                  </div>
                  <div className={styles.inputWrapper}>
                    <Input
                      label="Usuario"
                      id="username"
                      name="username"
                      value={formData.username}
                      disabled
                      icon={User}
                      iconPosition="left"
                    />
                    <p className={styles.fieldHint}>El nombre de usuario no se puede cambiar</p>
                  </div>
                </div>
              </div>

              <div className={styles.formActions}>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                  icon={Save}
                >
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </div>
            </form>
          </div>

          {/* Seguridad Card */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardHeaderLeft}>
                <div className={styles.cardIcon}>
                  <Lock size={20} />
                </div>
                <div>
                  <h2 className={styles.cardTitle}>Seguridad y Contraseña</h2>
                  <p className={styles.cardDescription}>
                    Cambia tu contraseña para mantener tu cuenta segura
                  </p>
                </div>
              </div>
            </div>

            <form className={styles.form} onSubmit={(e) => { e.preventDefault(); setIsPasswordModalOpen(true); }}>
              <div className={styles.formSection}>
                <div className={styles.sectionHeader}>
                  <h3 className={styles.sectionTitle}>Cambiar Contraseña</h3>
                  <div className={styles.tooltipContainer}>
                    <Info size={18} className={styles.tooltipIcon} />
                    <div className={styles.tooltip}>
                      <div className={styles.tooltipHeader}>
                        <AlertCircle size={18} />
                        <span>Recomendaciones de seguridad</span>
                      </div>
                      <ul className={styles.tooltipList}>
                        <li>Usa al menos 8 caracteres</li>
                        <li>Combina letras, números y símbolos</li>
                        <li>No uses información personal</li>
                        <li>Cambia tu contraseña regularmente</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.formSection}>
                <div className={styles.formGrid}>
                  <div className={styles.inputWrapper}>
                    <div className={styles.passwordInputWrapper}>
                      <Input
                        label="Contraseña Actual"
                        id="old_password"
                        name="old_password"
                        type={showPasswords.old ? 'text' : 'password'}
                        value={passwordData.old_password}
                        onChange={handlePasswordChange}
                        icon={Lock}
                        iconPosition="left"
                        error={passwordErrors.old_password}
                        required
                      />
                      <button
                        type="button"
                        className={styles.passwordToggle}
                        onClick={() => togglePasswordVisibility('old')}
                        tabIndex={-1}
                      >
                        {showPasswords.old ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div className={styles.inputWrapper}>
                    <div className={styles.passwordInputWrapper}>
                      <Input
                        label="Nueva Contraseña"
                        id="new_password"
                        name="new_password"
                        type={showPasswords.new ? 'text' : 'password'}
                        value={passwordData.new_password}
                        onChange={handlePasswordChange}
                        icon={Lock}
                        iconPosition="left"
                        error={passwordErrors.new_password}
                        required
                      />
                      <button
                        type="button"
                        className={styles.passwordToggle}
                        onClick={() => togglePasswordVisibility('new')}
                        tabIndex={-1}
                      >
                        {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {passwordData.new_password && (
                      <div className={styles.passwordStrength}>
                        <div className={styles.strengthBar}>
                          <div
                            className={`${styles.strengthFill} ${
                              passwordData.new_password.length < 8
                                ? styles.weak
                                : passwordData.new_password.length < 12
                                ? styles.medium
                                : styles.strong
                            }`}
                            style={{
                              width: `${Math.min((passwordData.new_password.length / 16) * 100, 100)}%`,
                            }}
                          ></div>
                        </div>
                        <p className={styles.strengthText}>
                          {passwordData.new_password.length < 8
                            ? 'Débil'
                            : passwordData.new_password.length < 12
                            ? 'Media'
                            : 'Fuerte'}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className={styles.inputWrapper}>
                    <div className={styles.passwordInputWrapper}>
                      <Input
                        label="Confirmar Nueva Contraseña"
                        id="confirm_password"
                        name="confirm_password"
                        type={showPasswords.confirm ? 'text' : 'password'}
                        value={passwordData.confirm_password}
                        onChange={handlePasswordChange}
                        icon={Lock}
                        iconPosition="left"
                        error={passwordErrors.confirm_password}
                        required
                      />
                      <button
                        type="button"
                        className={styles.passwordToggle}
                        onClick={() => togglePasswordVisibility('confirm')}
                        tabIndex={-1}
                      >
                        {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {passwordData.confirm_password && passwordData.new_password === passwordData.confirm_password && (
                      <div className={styles.passwordMatch}>
                        <CheckCircle size={16} />
                        <span>Las contraseñas coinciden</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.formActions}>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                  icon={Lock}
                >
                  {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Modals */}
      <PhotoUploadModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        onUpload={handleUploadPhoto}
        currentPhoto={profileImageUrl}
        uploading={uploadingPhoto}
      />

      <ConfirmModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onConfirm={handleChangePassword}
        title="Confirmar Cambio de Contraseña"
        message="¿Estás seguro de que deseas cambiar tu contraseña? Deberás iniciar sesión nuevamente."
        confirmText="Cambiar Contraseña"
        cancelText="Cancelar"
        type="warning"
      />
    </div>
  )
}
