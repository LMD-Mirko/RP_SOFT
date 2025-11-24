import React from "react";
import styles from "./Error404.module.css";
import OwlImage from "../../assets/images/Rocky.png"; // tu imagen del búho

const Error404 = () => {
  return (
    <div className={styles.container}>
      <div className={styles.glow}></div>
      <div className={styles.lines}></div>

      <div className={styles.wrapper}>
        {/* TEXT LEFT */}
        <div className={styles.left}>
          <h1 className={styles.title}>404</h1>
          <h2 className={styles.subtitle}>Página no encontrada</h2>

          <p className={styles.description}>
            El castor revisó todos los servidores… pero esta ruta no existe.
          </p>

          <button
            className={styles.button}
            onClick={() => (window.location.href = "/")}
          >
            Volver al inicio
          </button>
        </div>

        {/* IMAGE RIGHT */}
        <div className={styles.right}>
          <img src={OwlImage} alt="Error 404" className={styles.image} />
        </div>
      </div>
    </div>
  );
};

export default Error404;