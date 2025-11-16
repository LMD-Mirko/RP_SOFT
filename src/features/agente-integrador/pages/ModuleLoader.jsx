import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./moduleLoader.css";

export default function ModuleLoader({ title }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="module-container">
      {loading ? (
        <>
          <div className="spinner"></div>
          <h2 className="module-title">Cargando {title}...</h2>
          <p className="module-text">
            Espere un momento mientras el módulo se prepara para iniciar.
          </p>
        </>
      ) : (
        <div className="module-content">
          <h2>✅ {title} cargado correctamente</h2>
          <p>
            Este es el espacio destinado al módulo de ayuda del sistema RP_SOFT.
            Aquí podrás integrar documentación, guías o enlaces de soporte.
          </p>
          <button className="back-btn" onClick={() => navigate("/sistema")}>
            🔙 Volver al Sistema General
          </button>
        </div>
      )}
    </div>
  );
}
