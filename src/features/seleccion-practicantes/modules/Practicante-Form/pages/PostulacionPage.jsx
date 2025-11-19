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
  { id: 1, label: 'Datos Personales', component: DatosPersonalesStep, evaluationType: null },
  { id: 2, label: 'Perfil', component: PerfilStep, evaluationType: 'profile' },
  { id: 3, label: 'Técnica', component: TecnicaStep, evaluationType: 'technical' },
  { id: 4, label: 'Psicológia', component: PsicologiaStep, evaluationType: 'psychological' },
  { id: 5, label: 'Motivación', component: MotivacionStep, evaluationType: 'motivation' },
  { id: 6, label: 'CV', component: CVStep, evaluationType: null },
  { id: 7, label: 'Confirmación', component: ConfirmacionStep, evaluationType: null },
]

export function PostulacionPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const toast = useToast()
  const { 
    loading, 
    convocatoriaId, 
    postulacionId,
    personalData,
    postulanteStatus,
    evaluationsStatus,
    postularse, 
    guardarDatosPersonales, 
    subirCV,
    iniciarEvaluacion,
    obtenerDatosPersonales,
    obtenerEstadoPostulante,
    guardarEncuestaPerfil,
    guardarEncuestaPsicologica,
    guardarEncuestaMotivacion,
  } = usePostulacion()
  
  // Estado para saber qué campos vienen del User (son de solo lectura)
  const [userFields, setUserFields] = useState({
    name: false,
    paternal_lastname: false,
    maternal_lastname: false,
    document_number: false,
    phone: false,
    district_id: false,
  })
  
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

  // Cargar datos personales primero para obtener job_posting_id si no hay convocatoriaId en URL
  useEffect(() => {
    if (!convocatoriaId) {
      obtenerDatosPersonales().then(data => {
        // Si hay job_posting_id en los datos personales, usarlo
        if (data?.job_posting_id) {
          // El hook ya actualiza convocatoriaId automáticamente
        }
      })
    }
  }, [])

  // Cargar estado del postulante cuando hay convocatoriaId
  useEffect(() => {
    if (convocatoriaId) {
      obtenerEstadoPostulante(convocatoriaId)
    }
  }, [convocatoriaId])

  // Cargar datos personales (GET siempre retorna 200 OK con datos del User)
  useEffect(() => {
    if (currentStep === 1) {
      obtenerDatosPersonales().then(data => {
        if (data) {
          // Mapear nivel de experiencia del API al formato del formulario
          const experienceLevelMap = {
            'beginner': 'principiante',
            'intermediate': 'intermedio',
            'advanced': 'avanzado',
            'principiante': 'principiante',
            'intermedio': 'intermedio',
            'avanzado': 'avanzado'
          };

          // Mapear datos de la API al formato del formulario
          // La API devuelve: name, paternal_lastname, maternal_lastname (del User)
          const nombres = data.name || '';
          const apellidos = [data.paternal_lastname, data.maternal_lastname].filter(Boolean).join(' ');

          // Identificar qué campos vienen del User (son de solo lectura)
          setUserFields({
            name: !!data.name,
            paternal_lastname: !!data.paternal_lastname,
            maternal_lastname: !!data.maternal_lastname,
            document_number: !!data.document_number,
            phone: !!data.phone,
            district_id: !!data.district_id,
          });

          // Obtener nombre del distrito (puede venir como objeto o string)
          const districtName = typeof data.district === 'object' 
            ? data.district?.name 
            : data.district;

          setFormData(prev => ({
            ...prev,
            // Campos del User (vienen pre-llenados, son de solo lectura)
            nombres: nombres || prev.nombres || '',
            apellidos: apellidos || prev.apellidos || '',
            dni: data.document_number || prev.dni || '',
            telefono: data.phone ? data.phone.replace(/^\+51/, '') : prev.telefono || '',
            // Si la ubicación viene del User, solo guardar el nombre (NO selectedData para no pre-llenar CascadeSelect)
            distrito: districtName || prev.distrito || '',
            selectedData: data.district_id ? null : (prev.selectedData || null), // NO pre-llenar si viene del User
            
            // Campos específicos del postulante (editables, pueden ser null)
            fechaNacimiento: data.birth_date || prev.fechaNacimiento || '',
            direccion: data.address || prev.direccion || '',
            especialidadId: data.specialty_id || data.specialty?.id || prev.especialidadId || '',
            carrera: data.career || prev.carrera || '',
            semestre: data.semester || prev.semestre || '',
            nivelExperiencia: experienceLevelMap[data.experience_level] || prev.nivelExperiencia || 'principiante',
          }));
        }
      }).catch(error => {
        // El GET siempre debería retornar datos, pero por si acaso
        console.error('Error al obtener datos personales:', error);
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
        // Recargar estado del postulante después de guardar datos personales
        if (convocatoriaId) {
          await obtenerEstadoPostulante(convocatoriaId);
        }
      } catch (error) {
        // El error ya se maneja en el hook
        return; // No avanzar si hay error
      }
    }
    
    // Los pasos 2-5 (evaluaciones) se manejan dentro de sus componentes
    // EvaluacionEmbedded llama a onNext cuando se completa la evaluación
    
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
          convocatoriaId={convocatoriaId}
          userFields={userFields}
          personalData={personalData}
          evaluationId={STEPS[currentStep - 1].evaluationType ? evaluationsStatus[STEPS[currentStep - 1].evaluationType]?.evaluation_id : null}
          evaluationStatus={STEPS[currentStep - 1].evaluationType ? evaluationsStatus[STEPS[currentStep - 1].evaluationType] : null}
          onEvaluationComplete={async () => {
            // Recargar estado después de completar evaluación
            if (convocatoriaId) {
              await obtenerEstadoPostulante(convocatoriaId);
            }
          }}
        />
      </div>
    </div>
  )
}