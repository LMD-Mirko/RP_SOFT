import { useEstadisticasHistorial } from '../../hooks';
import styles from './EstadisticasResumen.module.css';

const EstadisticasResumen = () => {
  const { estadisticas, loading } = useEstadisticasHistorial();

  if (loading) {
    return (
      <div className={styles.container}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className={styles.card}>
            <div className={styles.content}>
              <div className={styles.label}>Cargando...</div>
              <div className={styles.value}>-</div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const totalRegistros = estadisticas?.total_registros || 0;
  const advertencias = estadisticas?.total_advertencias || 0;
  const traslados = estadisticas?.total_traslados || 0;
  const expulsiones = estadisticas?.total_expulsiones || 0;
  const totalPracticantes = estadisticas?.total_practicantes || 0;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.content}>
          <div className={styles.label}>Total Registros</div>
          <div className={styles.value}>{totalRegistros}</div>
          <div className={styles.subtitle}>{totalPracticantes} practicantes</div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.content}>
          <div className={styles.label}>Advertencias</div>
          <div className={styles.value}>{advertencias}</div>
          <div className={styles.subtitle}>Total emitidas</div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.content}>
          <div className={styles.label}>Traslados</div>
          <div className={styles.value}>{traslados}</div>
          <div className={styles.subtitle}>A reforzamiento</div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.content}>
          <div className={styles.label}>Expulsiones</div>
          <div className={styles.value}>{expulsiones}</div>
          <div className={styles.subtitle}>Definitivas</div>
        </div>
      </div>
    </div>
  );
};

export default EstadisticasResumen;
