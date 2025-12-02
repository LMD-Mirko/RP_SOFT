import { useState, useEffect } from 'react'
import { User, Mail, Lock, Save, Camera, Shield, CheckCircle, AlertCircle, Eye, EyeOff, Calendar, MapPin, Phone, CreditCard, Globe, Info, HelpCircle } from 'lucide-react'
import { Input } from '@shared/components/Input'
import { Button } from '@shared/components/Button'
import { Select } from '@shared/components/Select'
import { DocumentTypeSelect } from '@shared/components/DocumentTypeSelect'
import { CascadeSelect } from '@shared/components/CascadeSelect'
import { useProfile } from '../hooks/useProfile'
import { ConfirmModal } from '@shared/components/ConfirmModal'
import { PhotoUploadModal } from '../components/PhotoUploadModal'
import { ChangePasswordModal } from '../components/ChangePasswordModal'
import { ChangeEmailModal } from '../components/ChangeEmailModal'
import { Skeleton } from '../../../../seleccion-practicantes/shared/components/Skeleton'
import styles from './PerfilPage.module.css'

export function PerfilPage() {
  const { profile, loading, loadProfile, updateProfile, changePassword, requestChangeEmail, confirmChangeEmail, uploadPhoto, profileImageUrl } = useProfile()
  const [formData, setFormData] = useState({
    name: '',
    paternal_lastname: '',
    maternal_lastname: '',
    username: '',
    document_type_id: null,
    document_number: '',
    sex: 'M',
    phone: '',
    country_id: 429, // Perú por defecto
    region_id: null,
    province_id: null,
    district_id: null,
  })
  const [errors, setErrors] = useState({})
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [])

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        paternal_lastname: profile.paternal_lastname || '',
        maternal_lastname: profile.maternal_lastname || '',
        username: profile.username || '',
        document_type_id: profile.document_type_id || null,
        document_number: profile.document_number || '',
        sex: profile.sex || 'M',
        phone: profile.phone || '',
        country_id: profile.country_id || 429, // Perú por defecto
        region_id: profile.region_id || null,
        province_id: profile.province_id || null,
        district_id: profile.district_id || null,
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

  // Manejar cambio de ubicación (CascadeSelect)
  const handleLocationChange = (e) => {
    const { regionId, provinceId, districtId } = e.target
    setFormData(prev => ({
      ...prev,
      region_id: regionId,
      province_id: provinceId,
      district_id: districtId,
    }))
    if (errors.district_id) {
      setErrors(prev => ({ ...prev, district_id: '' }))
    }
  }

  const validateProfile = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido'
    if (!formData.paternal_lastname.trim()) newErrors.paternal_lastname = 'El apellido paterno es requerido'
    if (formData.document_type_id && !formData.document_number.trim()) {
      newErrors.document_number = 'El número de documento es requerido'
    }
    if (formData.document_number && !formData.document_type_id) {
      newErrors.document_type_id = 'El tipo de documento es requerido'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    if (!validateProfile()) return

    try {
      const updateData = {
        name: formData.name,
        paternal_lastname: formData.paternal_lastname,
        maternal_lastname: formData.maternal_lastname,
      }

      // Agregar campos opcionales solo si tienen valor
      if (formData.document_type_id) updateData.document_type_id = formData.document_type_id
      if (formData.document_number) updateData.document_number = formData.document_number
      if (formData.sex) updateData.sex = formData.sex
      if (formData.phone) updateData.phone = formData.phone
      if (formData.country_id) updateData.country_id = formData.country_id
      if (formData.region_id) updateData.region_id = formData.region_id
      if (formData.province_id) updateData.province_id = formData.province_id
      if (formData.district_id) updateData.district_id = formData.district_id

      await updateProfile(updateData)
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

  // Mostrar skeleton mientras carga o no hay perfil
  if (loading || !profile) {
    return (
      <div className={styles.container}>
        <div className={styles.layout}>
          {/* Left Column - Profile Card Skeleton */}
          <div className={styles.leftColumn}>
            <div className={styles.profileCard}>
              <div className={styles.profileHeader}>
                <div className={styles.avatarWrapper}>
                  <Skeleton variant="circular" width={120} height={120} />
                </div>
                <Skeleton variant="text" width="60%" height={28} style={{ marginTop: '16px' }} />
                <Skeleton variant="text" width="40%" height={16} style={{ marginTop: '8px' }} />
              </div>
              <div className={styles.profileInfo}>
                <div className={styles.infoSection}>
                  <Skeleton variant="text" width="50%" height={20} style={{ marginBottom: '16px' }} />
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className={styles.infoItem} style={{ marginBottom: '12px' }}>
                      <Skeleton variant="rectangular" width={18} height={18} />
                      <div style={{ flex: 1, marginLeft: '12px' }}>
                        <Skeleton variant="text" width="40%" height={14} />
                        <Skeleton variant="text" width="60%" height={16} style={{ marginTop: '4px' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Forms Skeleton */}
          <div className={styles.rightColumn}>
            <div className={styles.card}>
              <Skeleton variant="text" width="40%" height={24} style={{ marginBottom: '24px' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} variant="rectangular" width="100%" height={56} />
                ))}
              </div>
            </div>
            <div className={styles.card} style={{ marginTop: '24px' }}>
              <Skeleton variant="text" width="40%" height={24} style={{ marginBottom: '24px' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} variant="rectangular" width="100%" height={56} />
                ))}
              </div>
            </div>
          </div>
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
                      disabled={loading}
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
                      disabled={loading}
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
                      disabled={loading}
                    />
                  </div>
                  <div className={styles.inputWrapper}>
                    <DocumentTypeSelect
                      label="Tipo de Documento"
                      id="document_type_id"
                      name="document_type_id"
                      value={formData.document_type_id}
                      onChange={handleChange}
                      placeholder="Seleccione tipo de documento"
                      error={errors.document_type_id}
                      disabled={loading}
                    />
                  </div>
                  <div className={styles.inputWrapper}>
                    <Input
                      label="Número de Documento"
                      id="document_number"
                      name="document_number"
                      value={formData.document_number}
                      onChange={handleChange}
                      icon={CreditCard}
                      iconPosition="left"
                      error={errors.document_number}
                      disabled={loading}
                    />
                  </div>
                  <div className={styles.inputWrapper}>
                    <Select
                      label="Sexo"
                      id="sex"
                      name="sex"
                      value={formData.sex}
                      onChange={handleChange}
                      options={[
                        { value: 'M', label: 'Masculino' },
                        { value: 'F', label: 'Femenino' },
                        { value: 'O', label: 'Otro' },
                      ]}
                      error={errors.sex}
                      disabled={loading}
                    />
                  </div>
                  <div className={styles.inputWrapper}>
                    <Input
                      label="Teléfono"
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      icon={Phone}
                      iconPosition="left"
                      error={errors.phone}
                      disabled={loading}
                    />
                  </div>
                  <div className={styles.inputWrapper}>
                    <CascadeSelect
                      label="Ubicación"
                      id="district_id"
                      name="district_id"
                      value={formData.district_id}
                      regionId={formData.region_id}
                      provinceId={formData.province_id}
                      districtId={formData.district_id}
                      onChange={handleLocationChange}
                      placeholder="Seleccione Región > Provincia > Distrito"
                      error={errors.district_id}
                      disabled={loading}
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
                      value={profile?.email || ''}
                      disabled
                      icon={Mail}
                      iconPosition="left"
                    />
                    <p className={styles.fieldHint}>
                      Para cambiar tu email, usa la opción en la sección de Seguridad
                    </p>
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
                  <Shield size={20} />
                </div>
                <div>
                  <h2 className={styles.cardTitle}>Seguridad</h2>
                  <p className={styles.cardDescription}>
                    Gestiona la seguridad de tu cuenta
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.securitySections}>
              {/* Cambio de Contraseña */}
              <div className={styles.securitySection}>
                <div className={styles.securitySectionHeader}>
                  <div className={styles.securitySectionIcon}>
                    <Lock size={20} />
                  </div>
                  <div className={styles.securitySectionContent}>
                    <div className={styles.securitySectionTitleRow}>
                      <h3 className={styles.securitySectionTitle}>Cambiar Contraseña</h3>
                      {profile?.provider && profile.provider !== 'email' && (
                        <div className={styles.tooltipWrapper}>
                          <HelpCircle size={18} className={styles.tooltipIcon} />
                          <div className={styles.tooltip}>
                            <div className={styles.tooltipHeader}>
                              <AlertCircle size={16} />
                              <span>Cambio de contraseña no disponible</span>
                            </div>
                            <p className={styles.tooltipText}>
                              Tu cuenta está asociada a un proveedor externo ({profile?.provider || 'externo'}). 
                              No puedes cambiar tu contraseña directamente desde aquí. 
                              Debes hacerlo desde la plataforma del proveedor.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    <p className={styles.securitySectionDescription}>
                      Actualiza tu contraseña para mantener tu cuenta segura
                    </p>
                  </div>
                </div>
                <Button
                  variant="primary"
                  onClick={() => setIsPasswordModalOpen(true)}
                  disabled={loading || (profile?.provider && profile.provider !== 'email')}
                  icon={Lock}
                >
                  Cambiar Contraseña
                </Button>
              </div>

              {/* Cambio de Email */}
              <div className={styles.securitySection}>
                <div className={styles.securitySectionHeader}>
                  <div className={styles.securitySectionIcon}>
                    <Mail size={20} />
                  </div>
                  <div className={styles.securitySectionContent}>
                    <div className={styles.securitySectionTitleRow}>
                      <h3 className={styles.securitySectionTitle}>Cambiar Email</h3>
                      {profile?.provider && profile.provider !== 'email' && (
                        <div className={styles.tooltipWrapper}>
                          <HelpCircle size={18} className={styles.tooltipIcon} />
                          <div className={styles.tooltip}>
                            <div className={styles.tooltipHeader}>
                              <AlertCircle size={16} />
                              <span>Cambio de email no disponible</span>
                            </div>
                            <p className={styles.tooltipText}>
                              Tu cuenta está asociada a un proveedor externo ({profile?.provider || 'externo'}). 
                              No puedes cambiar tu email directamente desde aquí. 
                              Debes hacerlo desde la plataforma del proveedor.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    <p className={styles.securitySectionDescription}>
                      Actualiza tu dirección de correo electrónico
                    </p>
                  </div>
                </div>
                <Button
                  variant="primary"
                  onClick={() => setIsEmailModalOpen(true)}
                  disabled={loading || (profile?.provider && profile.provider !== 'email')}
                  icon={Mail}
                >
                  Cambiar Email
                </Button>
              </div>
            </div>
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

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onChangePassword={changePassword}
        loading={loading}
        canChangePassword={!profile?.provider || profile.provider === 'email'}
        provider={profile?.provider}
      />

      <ChangeEmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        onRequestChange={requestChangeEmail}
        onConfirmChange={confirmChangeEmail}
        loading={loading}
        canChangeEmail={!profile?.provider || profile.provider === 'email'}
        provider={profile?.provider}
        currentEmail={profile?.email}
      />
    </div>
  )
}
