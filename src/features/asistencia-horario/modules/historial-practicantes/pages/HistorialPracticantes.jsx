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
  const historialDetallado = historialData.length > 0
    ? historialData.map(transformHistorialItem)
    : [];

  // Los filtros ya se aplican en el backend
  const filteredHistorialDetallado = useMemo(() => {
    return historialDetallado;
  }, [historialDetallado]);

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
                  {loading ? (
                    <div className={styles.loadingMessage}>Cargando resumen...</div>
                  ) : (
                    <div className={styles.emptyMessage}>
                      El resumen por practicante se mostrará cuando el backend proporcione esta funcionalidad.
                    </div>
                  )}
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
