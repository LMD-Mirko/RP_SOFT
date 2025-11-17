import styles from './FiltrosHistorial.module.css';

const FiltrosHistorial = ({ onFilterChange, filters }) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>Filtros</span>
      </div>

      <div className={styles.filtersGrid}>
        <div className={styles.filterGroup}>
          <label className={styles.label}>Buscar</label>
          <div className={styles.searchWrapper}>
            <input
              type="text"
              placeholder="Nombre, email o motivo..."
              className={styles.searchInput}
              value={filters.buscar}
              onChange={(e) => onFilterChange('buscar', e.target.value)}
            />
          </div>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.label}>Área</label>
          <select 
            className={styles.select}
            value={filters.area}
            onChange={(e) => onFilterChange('area', e.target.value)}
          >
            <option value="">Todas las áreas</option>
            <option value="Desarrollo">Desarrollo</option>
            <option value="Marketing">Marketing</option>
            <option value="Ventas">Ventas</option>
            <option value="Soporte">Soporte</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.label}>Tipo de Acción</label>
          <select 
            className={styles.select}
            value={filters.tipoAccion}
            onChange={(e) => onFilterChange('tipoAccion', e.target.value)}
          >
            <option value="">Todas las acciones</option>
            <option value="Advertencia">Advertencia</option>
            <option value="Traslado">Traslado</option>
            <option value="Expulsión">Expulsión</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.label}>Estado Final</label>
          <select 
            className={styles.select}
            value={filters.estado}
            onChange={(e) => onFilterChange('estado', e.target.value)}
          >
            <option value="">Todos los estados</option>
            <option value="Activo">Activo</option>
            <option value="Transferido">Transferido</option>
            <option value="Expulsado">Expulsado</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FiltrosHistorial;
