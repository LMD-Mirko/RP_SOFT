import ResumenAsistencia from '../components/ResumenAsistencia/ResumenAsistencia';
import HistorialAsistencia from '../components/HistorialAsistencia/HistorialAsistencia';
import JustificacionesEnviadas from '../components/JustificacionesEnviadas/JustificacionesEnviadas';
import styles from './ControlAsistencia.module.css';

const ControlAsistencia = () => {
  const resumenData = {
    estado: 'Presente',
    entrada: '8:00 AM',
    salida: '05:00 PM',
    tardanza: '0 min',
    horasTrabajadas: '8h'
  };

  const historialData = [
    { fecha: '23 Oct 2025', entrada: '08:00 AM', salida: '05:00 PM', tardanza: 'A tiempo', justificacion: '-' },
    { fecha: '22 Oct 2025', entrada: '08:15 AM', salida: '05:10 PM', tardanza: '15 min', justificacion: 'Trafico' },
    { fecha: '21 Oct 2025', entrada: '08:00 AM', salida: '05:00 PM', tardanza: 'A tiempo', justificacion: '-' },
    { fecha: '20 Oct 2025', entrada: 'Con Clase', salida: '-', tardanza: 'A tiempo', justificacion: 'Clases Programadas' },
    { fecha: '19 Oct 2025', entrada: '08:05 AM', salida: '05:00 PM', tardanza: '5 min', justificacion: '-' },
    { fecha: '18 Oct 2025', entrada: '08:00 AM', salida: '05:00 PM', tardanza: 'A tiempo', justificacion: '-' },
    { fecha: '17 Oct 2025', entrada: '08:00 AM', salida: '04:30 PM', tardanza: 'A tiempo', justificacion: '-' },
  ];

  const justificacionesData = [
    { fecha: '22 Oct 2025', motivo: 'Trafico intenso', estado: 'Aprobado' },
    { fecha: '15 Oct 2025', motivo: 'Cita médica', estado: 'Aprobado' },
    { fecha: '10 Oct 2025', motivo: 'Problemas familiar', estado: 'Pendiente' },
  ];

  return (
    <div className='w-full min-h-screen bg-gray-50'>
      <div className='flex justify-center'>
        <div className='w-full max-w-[1400px] px-8 py-8'>
          <div className={`mb-8 ${styles.header}`}>
            <h1 className='text-2xl font-bold mb-2'>Control de Asistencia</h1>
            <p className='text-gray-600'>Revisa tu registro de asistencia y justificaciones</p>
          </div>
          
          <div className='flex flex-col gap-6'>
            <ResumenAsistencia {...resumenData} />
            <HistorialAsistencia historial={historialData} />
            <JustificacionesEnviadas justificaciones={justificacionesData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlAsistencia;
