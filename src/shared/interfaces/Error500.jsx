import React from "react";
import styles from "./Error500.module.css";
import ErrorImage from "../../assets/images/Error_500.png";

const Error500 = () => {
  return (
    <div className={styles.container}>
      <div className={styles.glow}></div>
      <div className={styles.lines}></div>

      <div className={styles.content}>
        <img src={ErrorImage} alt="Error 500" className={styles.image} />

        <h1 className={styles.title}>500</h1>
        <h2 className={styles.subtitle}>Error Interno del Servidor</h2>

        <p className={styles.description}>
          Ocurrió un fallo inesperado. Nuestro sistema está reiniciando módulos…
        </p>

        <button className={styles.button} onClick={() => window.location.reload()}>
          Reintentar
        </button>
      </div>
    </div>
  );
};

export default Error500;