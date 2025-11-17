import styles from './TablaHistorialDetallado.module.css';

const TablaHistorialDetallado = ({ data = [] }) => {
  const getAccionBadgeClass = (accion) => {
    if (accion.includes('Advertencia')) return styles.badgeAdvertencia;
    if (accion.includes('Traslado')) return styles.badgeTraslado;
    if (accion.includes('Expulsión')) return styles.badgeExpulsion;
    return styles.badgeAdvertencia;
  };

  const getEstadoBadgeClass = (estado) => {
    if (estado === 'Activo') return styles.badgeActivo;
    if (estado === 'Transferido') return styles.badgeTransferido;
    if (estado === 'Expulsado') return styles.badgeExpulsado;
    return styles.badgeActivo;
  };

  return (
    <div className={styles.container}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.headerRow}>
              <th className={styles.headerCell}>Practicante</th>
              <th className={styles.headerCell}>Área</th>
              <th className={styles.headerCell}>Acción</th>
              <th className={styles.headerCell}>Fecha</th>
              <th className={styles.headerCell}>Motivo</th>
              <th className={styles.headerCell}>Detalles</th>
              <th className={styles.headerCell}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className={styles.row}>
                <td className={styles.cell}>
                  <div className={styles.practicanteInfo}>
                    <div className={styles.nombre}>{item.nombre}</div>
                    <div className={styles.email}>{item.email}</div>
                  </div>
                </td>
                <td className={styles.cell}>{item.area}</td>
                <td className={styles.cell}>
                  <span className={`${styles.badge} ${getAccionBadgeClass(item.accion)}`}>
                    {item.accion}
                  </span>
                </td>
                <td className={styles.cell}>{item.fecha}</td>
                <td className={styles.cell}>{item.motivo}</td>
                <td className={styles.cell}>
                  <span className={styles.detalles}>{item.detalles}</span>
                </td>
                <td className={styles.cell}>
                  <span className={`${styles.badge} ${getEstadoBadgeClass(item.estado)}`}>
                    {item.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablaHistorialDetallado;
