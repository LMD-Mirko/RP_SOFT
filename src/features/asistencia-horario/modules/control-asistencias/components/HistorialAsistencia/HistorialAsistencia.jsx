import styles from './HistorialAsistencia.module.css';

const HistorialAsistencia = ({ historial = [] }) => {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Historial de Asistencia (Últimos 7 días)</h3>
      
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.headerRow}>
              <th className={styles.headerCell}>Fecha</th>
              <th className={styles.headerCell}>Hora de Entrada</th>
              <th className={styles.headerCell}>Hora de Salida</th>
              <th className={styles.headerCell}>Tardanza (min)</th>
              <th className={styles.headerCell}>Justificación</th>
            </tr>
          </thead>
          <tbody>
            {historial.map((item, index) => (
              <tr key={index} className={styles.row}>
                <td className={styles.cell}>{item.fecha}</td>
                <td className={styles.cell}>{item.entrada}</td>
                <td className={styles.cell}>{item.salida}</td>
                <td className={styles.cell}>{item.tardanza}</td>
                <td className={styles.cell}>{item.justificacion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistorialAsistencia;
