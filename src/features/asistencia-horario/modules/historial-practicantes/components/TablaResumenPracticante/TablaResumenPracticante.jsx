import styles from './TablaResumenPracticante.module.css';

const TablaResumenPracticante = ({ data = [] }) => {
  const getEstadoBadgeClass = (estado) => {
    if (estado === 'Activo') return styles.badgeActivo;
    if (estado === 'Transferido') return styles.badgeTransferido;
    if (estado === 'Expulsado') return styles.badgeExpulsado;
    return styles.badgeActivo;
  };

  const getSistemaBadgeClass = (enSistema) => {
    if (enSistema === 'Presente') return styles.badgePresente;
    if (enSistema === 'Eliminado') return styles.badgeEliminado;
    return styles.badgePresente;
  };

  return (
    <div className={styles.container}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.headerRow}>
              <th className={styles.headerCell}>Practicante</th>
              <th className={styles.headerCell}>Área</th>
              <th className={styles.headerCell}>Advertencias</th>
              <th className={styles.headerCell}>Traslados</th>
              <th className={styles.headerCell}>Estado</th>
              <th className={styles.headerCell}>Última Acción</th>
              <th className={styles.headerCell}>En Sistema</th>
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
                  <span className={styles.badgeAdvertencias}>{item.advertencias}</span>
                </td>
                <td className={styles.cell}>
                  <span className={styles.badgeTraslados}>{item.traslados}</span>
                </td>
                <td className={styles.cell}>
                  <span className={`${styles.badge} ${getEstadoBadgeClass(item.estado)}`}>
                    {item.estado}
                  </span>
                </td>
                <td className={styles.cell}>{item.ultimaAccion}</td>
                <td className={styles.cell}>
                  <span className={`${styles.badge} ${getSistemaBadgeClass(item.enSistema)}`}>
                    {item.enSistema}
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

export default TablaResumenPracticante;
