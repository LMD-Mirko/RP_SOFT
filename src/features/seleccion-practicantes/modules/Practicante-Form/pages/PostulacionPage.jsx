import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { DatosPersonalesStep } from '../components/DatosPersonales'
import { PerfilStep } from '../components/Perfil'
import { TecnicaStep } from '../components/Tecnica'
import { PsicologiaStep } from '../components/Psicologia'
import { MotivacionStep } from '../components/Motivacion'
import { CVStep } from '../components/CV'
import { ConfirmacionStep } from '../components/Confirmacion'
import { usePostulacion } from '../hooks/usePostulacion'
import { useToast } from '@shared/components/Toast'
import styles from './PostulacionPage.module.css'

const STEPS = [
  { id: 1, label: 'Datos Personales', component: DatosPersonalesStep },
  { id: 2, label: 'Perfil', component: PerfilStep },
  { id: 3, label: 'Técnica', component: TecnicaStep },
  { id: 4, label: 'Psicológia', component: PsicologiaStep },
  { id: 5, label: 'Motivación', component: MotivacionStep },
  { id: 6, label: 'CV', component: CVStep },
  { id: 7, label: 'Confirmación', component: ConfirmacionStep },
]

export function PostulacionPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const toast = useToast()
  const { 
    loading, 
    convocatoriaId, 
    postularse, 
    guardarDatosPersonales, 
    subirCV,
    iniciarEvaluacion,
    obtenerDatosPersonales 
  } = usePostulacion()
  
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Datos Personales
    nombres: '',
    apellidos: '',
    telefono: '',
    dni: '',
    fechaNacimiento: '',
    distrito: '',
    direccion: '',
    sexo: 'M',
    especialidadId: '',
    carrera: '',
    semestre: '',
    nivelExperiencia: 'principiante',
    selectedData: null,

    // Perfil
    areaInteres: '',
    experienciaPrevia: '',
    nivelCompromiso: '',

    // Técnica
    nivelHTML: '',
    nivelCSS: '',
    nivelJavaScript: '',

    // Psicología
    trabajoEquipo: '',
    manejoConflictos: '',
    actitudDesafios: '',

    // Motivación
    motivacion: '',
    expectativas: '',
    participacionProyectos: '',

    // CV
    cvFile: null,
  })

  // Verificar si hay convocatoriaId y postularse automáticamente
  useEffect(() => {
    const checkPostulacion = async () => {
      const id = searchParams.get('convocatoria');
      if (id) {
        try {
          await postularse(parseInt(id));
        } catch (error) {
          // Si ya está postulado o hay error, continuar de todas formas
          console.log('Error o ya postulado:', error);
        }
      }
    };
    checkPostulacion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Cargar datos personales si existen
  useEffect(() => {
    if (currentStep === 1) {
      obtenerDatosPersonales().then(data => {
        if (data) {
          // Mapear datos de la API al formato del formulario
          setFormData(prev => ({
            ...prev,
            dni: data.document_number || '',
            tipoDocumento: data.document_type_id || '',
            fechaNacimiento: data.birth_date || '',
            telefono: data.phone?.replace('+51', '') || '',
            sexo: data.sex || 'M',
            direccion: data.address || '',
            especialidadId: data.specialty_id || '',
            carrera: data.career || '',
            semestre: data.semester || '',
            nivelExperiencia: data.experience_level || 'principiante',
            distrito: data.district_id || '',
            selectedData: {
              distrito: { id: data.district_id, name: '' },
              provincia: { id: data.province_id, name: '' },
              region: { id: data.region_id, name: '' },
            },
          }));
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  const updateFormData = (stepData) => {
    setFormData(prev => ({ ...prev, ...stepData }))
  }

  const handleNext = async (stepData) => {
    updateFormData(stepData)
    
    // Si es el paso 1 (Datos Personales), guardar en la API
    if (currentStep === 1) {
      try {
        await guardarDatosPersonales({ ...formData, ...stepData });
      } catch (error) {
        // El error ya se maneja en el hook
        return; // No avanzar si hay error
      }
    }
    
    // Si es el paso 6 (CV), subir el archivo
    if (currentStep === 6 && stepData.cvFile) {
      try {
        await subirCV(stepData.cvFile);
      } catch (error) {
        // El error ya se maneja en el hook
        return; // No avanzar si hay error
      }
    }

    if (currentStep < STEPS.length) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSubmit = async (stepData) => {
    updateFormData(stepData)

    try {
      // Si hay CV, subirlo
      if (stepData.cvFile) {
        await subirCV(stepData.cvFile);
      }

      // Iniciar evaluación si hay convocatoriaId
      if (convocatoriaId) {
        await iniciarEvaluacion(convocatoriaId);
      }

      toast.success('Postulación completada exitosamente');
      
      // Redirigir al dashboard o página de confirmación
      setTimeout(() => {
        navigate('/seleccion-practicantes');
      }, 2000);
    } catch (error) {
      // El error ya se maneja en el hook
      console.error('Error al completar postulación:', error);
    }
  }

  const CurrentStepComponent = STEPS[currentStep - 1].component

  return (
    <div className={styles.container}>
      {/* Header con Steps */}
      <div className={styles.header}>
        <div className={styles.stepsContainer}>
          {STEPS.map((step) => (
            <div
              key={step.id}
              className={`${styles.step} ${currentStep === step.id ? styles.stepActive :
                  currentStep > step.id ? styles.stepCompleted : ''
                }`}
            >
              <div className={styles.stepNumber}>{step.id}</div>
              <span className={styles.stepLabel}>{step.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <CurrentStepComponent
          data={formData}
          onNext={handleNext}
          onBack={handleBack}
          onSubmit={handleSubmit}
          isFirstStep={currentStep === 1}
          isLastStep={currentStep === STEPS.length}
        />
      </div>
    </div>
  )
}