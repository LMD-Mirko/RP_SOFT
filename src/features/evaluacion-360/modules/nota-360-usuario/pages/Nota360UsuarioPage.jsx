import React from 'react';
import styles from './Nota360UsuarioPage.module.css';
import { LayoutGrid, CalendarDays, ChevronDown } from 'lucide-react';

const Nota360UsuarioPage = () => {
  return (
    <div className={styles.pageContainer}>
      
      {/* --- Cabecera --- */}
      <header className={styles.header}>
        <div className={styles.titleWrapper}>
          <span className={styles.titleIcon}>
            <LayoutGrid size={20} color="white" />
          </span>
          <h1 className={styles.title}>Nota de evaluacion 360</h1>
        </div>
        <p className={styles.subtitle}>
          Visualiza tus notas de la evaluacion 360
        </p>
      </header>

      {/* --- Selector de Semana --- */}
      <div className={styles.weekSelector}>
        <CalendarDays size={18} />
        <span>Seleccione una semana</span>
      </div>

      {/* --- Tabla de Notas --- */}
      <div className={styles.tableWrapper}>
        
        {/* Encabezado de la tabla */}
        <div className={styles.tableHeader}>
          <div>Servidor</div>
          <div>Sala</div>
          <div>Proyecto</div>
          <div>Estado</div>
          <div>Nota</div>
        </div>

        {/* Fila de datos */}
        <div className={styles.tableRow}>
          <div>6to Py de Innovacion</div>
          <div>5</div>
          <div>Sin subir</div>
          <div>Sin evaluar</div>
          <div>
            <button className={styles.pendingButton}>Por Calificar</button>
          </div>
        </div>

        {/* Toggle de Comentarios */}
        <div className={styles.commentsToggle}>
          <ChevronDown size={18} />
          <span>Mostrar comentarios</span>
        </div>
      </div>
    </div>
  );
};

export default Nota360UsuarioPage;