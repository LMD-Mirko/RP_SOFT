import styles from './JustificacionesEnviadas.module.css';

const JustificacionesEnviadas = ({ justificaciones = [] }) => {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Justificaciones Enviadas</h3>
      
      <div className={styles.list}>
        {justificaciones.map((item, index) => (
          <div 
            key={index} 
            className={`${styles.card} ${item.estado === 'Aprobado' ? styles.cardAprobado : styles.cardPendiente}`}
          >
            <div className={styles.cardContent}>
              <div 
                className={`${styles.icon} ${item.estado === 'Aprobado' ? styles.iconAprobado : styles.iconPendiente}`}
              />
              <div>
                <p className={styles.fecha}>{item.fecha}</p>
                <p className={styles.motivo}>{item.motivo}</p>
              </div>
            </div>
            <span className={styles.estado}>
              {item.estado}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JustificacionesEnviadas;
