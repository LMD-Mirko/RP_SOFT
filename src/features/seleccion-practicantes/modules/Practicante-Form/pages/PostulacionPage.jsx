import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DatosPersonalesStep } from '../components/DatosPersonales'
import { PerfilStep } from '../components/Perfil'
import { TecnicaStep } from '../components/Tecnica'
import { PsicologiaStep } from '../components/Psicologia'
import { MotivacionStep } from '../components/Motivacion'
import { CVStep } from '../components/CV'
import { ConfirmacionStep } from '../components/Confirmacion'
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

  const updateFormData = (stepData) => {
    setFormData(prev => ({ ...prev, ...stepData }))
  }

  const handleNext = (stepData) => {
    updateFormData(stepData)
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

    // Aquí iría la lógica para enviar los datos al backend
    console.log('Datos finales:', { ...formData, ...stepData })

    // Avanzar al paso de confirmación
    setCurrentStep(STEPS.length)
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