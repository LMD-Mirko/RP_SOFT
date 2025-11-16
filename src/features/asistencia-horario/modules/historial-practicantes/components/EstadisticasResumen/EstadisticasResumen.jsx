import styles from './EstadisticasResumen.module.css';

const EstadisticasResumen = ({ totalRegistros, advertencias, traslados, expulsiones }) => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.content}>
          <div className={styles.label}>Total Registros</div>
          <div className={styles.value}>{totalRegistros}</div>
          <div className={styles.subtitle}>5 practicantes</div>
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
