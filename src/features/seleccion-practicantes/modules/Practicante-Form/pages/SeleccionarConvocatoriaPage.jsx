import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@shared/components/Button'
import { Skeleton } from '../../../shared/components/Skeleton'
import { useToast } from '@shared/components/Toast'
import { Briefcase, Calendar, Users, ArrowRight } from 'lucide-react'
import { EmptyState } from '@shared/components/EmptyState'
import * as postulacionService from '../services'
import * as convocatoriaService from '../../convocatorias/services'
import styles from './SeleccionarConvocatoriaPage.module.css'

/**
 * Formatea una fecha ISO a formato DD/MM/YYYY
 */
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

export function SeleccionarConvocatoriaPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const [convocatorias, setConvocatorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedConvocatoria, setSelectedConvocatoria] = useState(null)
  const [postulando, setPostulando] = useState(false)

  useEffect(() => {
    const loadConvocatorias = async () => {
      try {
        setLoading(true)
        // Intentar con 'status' primero, luego con 'estado' como fallback
        const response = await convocatoriaService.getConvocatorias({ status: 'abierta' })
        setConvocatorias(response.results || response || [])
      } catch (error) {
        console.error('Error al cargar convocatorias:', error)
        // Intentar con 'estado' como fallback
        try {
          const fallbackResponse = await convocatoriaService.getConvocatorias({ estado: 'abierta' })
          setConvocatorias(fallbackResponse.results || fallbackResponse || [])
        } catch (fallbackError) {
          console.error('Error al cargar convocatorias (fallback):', fallbackError)
          toast.error('Error al cargar convocatorias disponibles')
        }
      } finally {
        setLoading(false)
      }
    }

    loadConvocatorias()
  }, [toast])

  const handleSeleccionar = async (convocatoria) => {
    if (postulando) return

    try {
      setPostulando(true)
      setSelectedConvocatoria(convocatoria.id)

      // Hacer POST para crear el postulante automáticamente
      await postulacionService.postularseConvocatoria(convocatoria.id)

      toast.success(`Te has postulado exitosamente a: ${convocatoria.title}`)
      
      // Redirigir al formulario de postulación con el convocatoriaId
      setTimeout(() => {
        navigate(`/seleccion-practicantes/postulacion?convocatoria=${convocatoria.id}`)
      }, 1000)
    } catch (error) {
      console.error('Error al postularse:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Error al postularse a la convocatoria'
      
      // Si el error es que ya está postulado, redirigir de todas formas
      if (errorMessage.includes('ya está postulado') || errorMessage.includes('already')) {
        toast.info('Ya estás postulado a esta convocatoria')
        setTimeout(() => {
          navigate(`/seleccion-practicantes/postulacion?convocatoria=${convocatoria.id}`)
        }, 1000)
      } else {
        toast.error(errorMessage)
        setSelectedConvocatoria(null)
      }
    } finally {
      setPostulando(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.header}>
            <h1 className={styles.title}>Selecciona una Convocatoria</h1>
            <p className={styles.subtitle}>Elige la convocatoria a la que deseas postularte</p>
          </div>
          <div className={styles.grid}>
            {[1, 2, 3].map((i) => (
              <div key={i} className={styles.card}>
                <Skeleton variant="rectangular" width="100%" height={200} />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (convocatorias.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <EmptyState
            iconPreset="folder"
            colorPreset="dark"
            iconColor="#0f172a"
            title="No hay convocatorias disponibles"
            description="Actualmente no hay convocatorias abiertas. Vuelve más tarde para ver nuevas oportunidades."
            className={styles.emptyState}
          />
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Selecciona una Convocatoria</h1>
          <p className={styles.subtitle}>Elige la convocatoria a la que deseas postularte</p>
        </div>

        <div className={styles.grid}>
          {convocatorias.map((convocatoria) => {
            const isSelected = selectedConvocatoria === convocatoria.id
            const isPostulando = postulando && isSelected

            return (
              <div key={convocatoria.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardTitleSection}>
                    <Briefcase size={24} className={styles.cardIcon} />
                    <h3 className={styles.cardTitle}>{convocatoria.title}</h3>
                  </div>
                  <span className={`${styles.badge} ${styles.badgeAbierta}`}>
                    Abierta
                  </span>
                </div>

                {convocatoria.description && (
                  <p className={styles.cardDescription}>{convocatoria.description}</p>
                )}

                <div className={styles.cardInfo}>
                  <div className={styles.infoItem}>
                    <Calendar size={16} className={styles.infoIcon} />
                    <div>
                      <span className={styles.infoLabel}>Inicio:</span>
                      <span className={styles.infoValue}>
                        {formatDate(convocatoria.start_date)}
                      </span>
                    </div>
                  </div>
                  <div className={styles.infoItem}>
                    <Calendar size={16} className={styles.infoIcon} />
                    <div>
                      <span className={styles.infoLabel}>Fin:</span>
                      <span className={styles.infoValue}>
                        {formatDate(convocatoria.end_date)}
                      </span>
                    </div>
                  </div>
                  <div className={styles.infoItem}>
                    <Users size={16} className={styles.infoIcon} />
                    <div>
                      <span className={styles.infoLabel}>Cupos:</span>
                      <span className={styles.infoValue}>
                        {convocatoria.cupos || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="primary"
                  onClick={() => handleSeleccionar(convocatoria)}
                  disabled={postulando}
                  className={styles.selectButton}
                  fullWidth
                >
                  {isPostulando ? (
                    'Postulando...'
                  ) : (
                    <>
                      Seleccionar
                      <ArrowRight size={18} />
                    </>
                  )}
                </Button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

