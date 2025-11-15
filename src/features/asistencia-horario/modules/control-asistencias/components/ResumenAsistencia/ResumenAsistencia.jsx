import styles from './ResumenAsistencia.module.css';

const ResumenAsistencia = ({ estado, entrada, salida, tardanza, horasTrabajadas }) => {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Resumen de Asistencia - Hoy</h3>
      
      <div className={styles.grid}>
        <div className={styles.item}>
          <div className={styles.label}>Estado</div>
          <div className={styles.value}>{estado}</div>
        </div>
        
        <div className={styles.item}>
          <div className={styles.label}>Entrada</div>
          <div className={styles.value}>{entrada}</div>
        </div>
        
        <div className={styles.item}>
          <div className={styles.label}>Salida</div>
          <div className={styles.value}>{salida}</div>
        </div>
        
        <div className={styles.item}>
          <div className={styles.label}>Tardanza</div>
          <div className={styles.value}>{tardanza}</div>
        </div>
        
        <div className={styles.item}>
          <div className={styles.label}>Horas Trabajadas</div>
          <div className={styles.value}>{horasTrabajadas}</div>
        </div>
      </div>
    </div>
  );
};

export default ResumenAsistencia;
