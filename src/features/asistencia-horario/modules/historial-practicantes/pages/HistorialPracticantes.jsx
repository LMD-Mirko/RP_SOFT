import { useState, useEffect, useMemo } from 'react';
import EstadisticasResumen from '../components/EstadisticasResumen/EstadisticasResumen';
import FiltrosHistorial from '../components/FiltrosHistorial/FiltrosHistorial';
import TablaHistorialDetallado from '../components/TablaHistorialDetallado/TablaHistorialDetallado';
import TablaResumenPracticante from '../components/TablaResumenPracticante/TablaResumenPracticante';
import { useHistorialPracticantes } from '../hooks';
import styles from './HistorialPracticantes.module.css';

// Función para transformar datos del backend al formato del frontend
const transformHistorialItem = (item) => {
  const tipoAccionMap = {
    'advertencia': 'Advertencia',
    'traslado': 'Traslado',
    'expulsion': 'Expulsión',
    'otro': 'Otro'
  };

  const estadoMap = {
    'activo': 'Activo',
    'trasladado': 'Transferido',
    'expulsado': 'Expulsado',
    'en_recuperacion': 'En Recuperación',
    'en_riesgo': 'En Riesgo'
  };

  return {
    nombre: item.practicante?.nombre || item.nombre || 'Sin nombre',
    email: item.practicante?.correo || item.email || '',
    area: item.practicante?.area || item.area || 'N/A',
    accion: tipoAccionMap[item.tipo_accion] || item.tipo_accion,
    fecha: item.fecha ? new Date(item.fecha).toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    }) : '',
    motivo: item.descripcion || '',
    detalles: item.detalles ? JSON.stringify(item.detalles) : '',
    estado: estadoMap[item.estado] || item.estado || 'Activo'
  };
};

const HistorialPracticantes = () => {
  const [activeTab, setActiveTab] = useState('detallado');
  const [filters, setFilters] = useState({
    buscar: '',
    area: '',
    tipoAccion: '',
    estado: ''
  });
  const [currentPage, setCurrentPage] = useState(1);

  const { 
    historial: historialData, 
    loading, 
    pagination,
    loadHistorial 
  } = useHistorialPracticantes();

  // Cargar historial cuando cambian los filtros
  useEffect(() => {
    loadHistorial(currentPage, filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filters.buscar, filters.area, filters.tipoAccion, filters.estado]);

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    setCurrentPage(1); // Resetear a primera página al cambiar filtros
  };

  // Transformar datos del backend
  const historialDetallado = historialData.map(transformHistorialItem);

  // Mock data para resumen (esto debería venir del backend también)
  const historialDetalladoMock = [
    { nombre: 'Juan Pérez', email: 'juan@example.com', area: 'Desarrollo', accion: 'Advertencia #1', fecha: '14 sept 2025', motivo: 'Primer llamado sin respuesta - Falta injustifi...', detalles: '', estado: 'Activo' },
    { nombre: 'Juan Pérez', email: 'juan@example.com', area: 'Desarrollo', accion: 'Advertencia #2', fecha: '24 sept 2025', motivo: 'Segundo llamado sin respuesta - Llegada ta...', detalles: '', estado: 'Activo' },
    { nombre: 'Juan Pérez', email: 'juan@example.com', area: 'Desarrollo', accion: 'Advertencia #3', fecha: '27 sept 2025', motivo: 'Tercer llamado sin respuesta - Ausencia sin...', detalles: '', estado: 'Activo' },
    { nombre: 'Roberto Jiménez', email: 'roberto@example.com', area: 'Marketing', accion: 'Advertencia #1', fecha: '9 ago 2025', motivo: 'Primera advertencia - Falta sin justificar', detalles: '', estado: 'Expulsado' },
    { nombre: 'Roberto Jiménez', email: 'roberto@example.com', area: 'Marketing', accion: 'Advertencia #2', fecha: '17 ago 2025', motivo: 'Segunda advertencia - Llegadas tardías rec...', detalles: '', estado: 'Expulsado' },
    { nombre: 'Roberto Jiménez', email: 'roberto@example.com', area: 'Marketing', accion: 'Advertencia #3', fecha: '24 ago 2025', motivo: 'Tercera advertencia - No contestar llamadas', detalles: '', estado: 'Expulsado' },
    { nombre: 'Roberto Jiménez', email: 'roberto@example.com', area: 'Marketing', accion: 'Expulsión', fecha: '31 ago 2025', motivo: 'Expulsión definitiva', detalles: 'Cuarta falta grave - Ausencia prolongada si...', estado: 'Expulsado' },
    { nombre: 'Carmen Valencia', email: 'carmen@example.com', area: 'Ventas', accion: 'Advertencia #1', fecha: '4 sept 2025', motivo: 'Primera advertencia - Incumplimiento de ho...', detalles: '', estado: 'Transferido' },
    { nombre: 'Carmen Valencia', email: 'carmen@example.com', area: 'Ventas', accion: 'Advertencia #2', fecha: '11 sept 2025', motivo: 'Segunda advertencia - Faltas recurrentes', detalles: '', estado: 'Transferido' },
    { nombre: 'Carmen Valencia', email: 'carmen@example.com', area: 'Ventas', accion: 'Traslado', fecha: '19 sept 2025', motivo: 'Traslado a Servidor de Reforzamiento', detalles: 'Traslado por acumulación de advertencias -...', estado: 'Transferido' },
    { nombre: 'María López', email: 'maria@example.com', area: 'Marketing', accion: 'Advertencia #1', fecha: '28 sept 2025', motivo: 'Primera advertencia - Segundo llamado sin ...', detalles: '', estado: 'Activo' },
    { nombre: 'Patricia Moreno', email: 'patricia@example.com', area: 'Soporte', accion: 'Advertencia #1', fecha: '31 jul 2025', motivo: 'Primera advertencia - Falta sin justificar', detalles: '', estado: 'Expulsado' },
    { nombre: 'Patricia Moreno', email: 'patricia@example.com', area: 'Soporte', accion: 'Expulsión', fecha: '14 ago 2025', motivo: 'Expulsión definitiva', detalles: 'Abandono del puesto sin previo aviso duran...', estado: 'Expulsado' },
  ];

  const resumenPracticantes = [
    { nombre: 'María López', email: 'maria@example.com', area: 'Marketing', advertencias: 1, traslados: 0, estado: 'Activo', ultimaAccion: '28 sept 2025', enSistema: 'Presente' },
    { nombre: 'Juan Pérez', email: 'juan@example.com', area: 'Desarrollo', advertencias: 3, traslados: 0, estado: 'Activo', ultimaAccion: '27 sept 2025', enSistema: 'Presente' },
    { nombre: 'Carmen Valencia', email: 'carmen@example.com', area: 'Ventas', advertencias: 2, traslados: 1, estado: 'Transferido', ultimaAccion: '19 sept 2025', enSistema: 'Eliminado' },
    { nombre: 'Roberto Jiménez', email: 'roberto@example.com', area: 'Marketing', advertencias: 3, traslados: 0, estado: 'Expulsado', ultimaAccion: '31 ago 2025', enSistema: 'Eliminado' },
    { nombre: 'Patricia Moreno', email: 'patricia@example.com', area: 'Soporte', advertencias: 1, traslados: 0, estado: 'Expulsado', ultimaAccion: '14 ago 2025', enSistema: 'Eliminado' },
  ];

  // Los filtros ya se aplican en el backend, pero podemos hacer un filtrado adicional si es necesario
  const filteredHistorialDetallado = useMemo(() => {
    return historialDetallado;
  }, [historialDetallado]);

  const filteredResumenPracticantes = useMemo(() => {
    return resumenPracticantes.filter(item => {
      const matchBuscar = !filters.buscar || 
        item.nombre.toLowerCase().includes(filters.buscar.toLowerCase()) ||
        item.email.toLowerCase().includes(filters.buscar.toLowerCase());
      
      const matchArea = !filters.area || item.area === filters.area;
      
      const matchEstado = !filters.estado || item.estado === filters.estado;

      return matchBuscar && matchArea && matchEstado;
    });
  }, [resumenPracticantes, filters]);

  return (
    <div className='w-full min-h-screen bg-gray-50'>
      <div className='flex justify-center'>
        <div className='w-full max-w-[1400px] px-8 py-8'>
          <div className={styles.header}>
            <div>
              <h1 className={styles.title}>Historial General de Practicantes</h1>
              <p className={styles.subtitle}>Registro permanente de advertencias, traslados y expulsiones</p>
            </div>
            <button className={styles.exportButton}>
              Exportar Excel
            </button>
          </div>

          <EstadisticasResumen />

          <FiltrosHistorial 
            filters={filters}
            onFilterChange={handleFilterChange}
          />

          <div className={styles.tabsContainer}>
            <div className={styles.tabs}>
              <button
                className={`${styles.tab} ${activeTab === 'detallado' ? styles.tabActive : ''}`}
                onClick={() => setActiveTab('detallado')}
              >
                Historial Detallado
              </button>
              <button
                className={`${styles.tab} ${activeTab === 'resumen' ? styles.tabActive : ''}`}
                onClick={() => setActiveTab('resumen')}
              >
                Resumen por Practicante
              </button>
            </div>

            <div className={styles.tabContent}>
              {activeTab === 'detallado' && (
                <div>
                  <div className={styles.tabHeader}>
                    <h3 className={styles.tabTitle}>Historial Detallado</h3>
                    <p className={styles.tabSubtitle}>Registro cronológico de todas las acciones disciplinarias</p>
                  </div>
                  {loading ? (
                    <div className={styles.loadingMessage}>Cargando historial...</div>
                  ) : (
                    <TablaHistorialDetallado data={filteredHistorialDetallado} />
                  )}
                </div>
              )}
              {activeTab === 'resumen' && (
                <div>
                  <div className={styles.tabHeader}>
                    <h3 className={styles.tabTitle}>Resumen por Practicante</h3>
                    <p className={styles.tabSubtitle}>Vista consolidada del historial de cada practicante</p>
                  </div>
                  <TablaResumenPracticante data={filteredResumenPracticantes} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistorialPracticantes;
