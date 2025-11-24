import React, { useState, useEffect } from 'react';  // Agregar useState y useEffect
import styles from './Nota360UsuarioPage.module.css';
import { LayoutGrid, CalendarDays, ChevronDown } from 'lucide-react';

const Nota360UsuarioPage = () => {
  // NUEVO: Estados para animaciones e interacciones
  const [mostrarContenido, setMostrarContenido] = useState(false);
  const [mostrarComentarios, setMostrarComentarios] = useState(false);

  // NUEVO: Efecto para animación de entrada
  useEffect(() => {
    setMostrarContenido(true);
  }, []);

  const toggleComentarios = () => {
    setMostrarComentarios(!mostrarComentarios);
  };

  return (
    <div className={`${styles.pageContainer} ${mostrarContenido ? styles.fadeIn : ''}`}>
      
      {/* --- Cabecera - CON ANIMACIÓN --- */}
      <header className={`${styles.header} ${styles.slideIn}`}>
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

      {/* --- Selector de Semana - CON ANIMACIÓN --- */}
      <div className={`${styles.weekSelector} ${styles.slideIn}`} style={{animationDelay: '0.1s'}}>
        <CalendarDays size={18} />
        <span>Seleccione una semana</span>
      </div>

      {/* --- Tabla de Notas - CON ANIMACIÓN --- */}
      <div className={`${styles.tableWrapper} ${styles.slideIn}`} style={{animationDelay: '0.2s'}}>
        
        {/* Encabezado de la tabla */}
        <div className={styles.tableHeader}>
          <div>Servidor</div>
          <div>Sala</div>
          <div>Proyecto</div>
          <div>Estado</div>
          <div>Nota</div>
        </div>

        {/* Fila de datos - CON EFECTOS */}
        <div className={styles.tableRow}>
          <div>6to Py de Innovacion</div>
          <div>5</div>
          <div>Sin subir</div>
          <div>
            <span className={`${styles.estadoBadge} ${styles.estadoNoEvaluado}`}>
              Sin evaluar
            </span>
          </div>
          <div>
            <button className={styles.pendingButton}>Por Calificar</button>
          </div>
        </div>

        {/* Toggle de Comentarios - MEJORADO */}
        <div 
          className={`${styles.commentsToggle} ${mostrarComentarios ? styles.commentsToggleActive : ''}`}
          onClick={toggleComentarios}
        >
          <ChevronDown 
            size={18} 
            className={`${styles.chevronIcon} ${mostrarComentarios ? styles.chevronRotated : ''}`} 
          />
          <span>{mostrarComentarios ? 'Ocultar' : 'Mostrar'} comentarios</span>
        </div>

        {/* Comentarios - CON ANIMACIÓN */}
        {mostrarComentarios && (
          <div className={`${styles.commentsSection} ${styles.slideIn}`}>
            <div className={styles.commentItem}>
              <strong>Comentarios del evaluador:</strong>
              <p>El practicante muestra buen desempeño en trabajo en equipo pero necesita mejorar en puntualidad.</p>
            </div>
            <div className={styles.commentItem}>
              <strong>Retroalimentación:</strong>
              <p>Se recomienda enfocarse en la entrega de reportes semanales.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Nota360UsuarioPage;