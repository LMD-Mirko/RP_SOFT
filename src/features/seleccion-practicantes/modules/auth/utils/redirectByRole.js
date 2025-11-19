/**
 * Función helper para redirigir según el rol y estado del postulante
 * @param {Object} userData - Datos del usuario que incluyen role_id y postulant_status
 * @param {Function} navigate - Función de navegación de react-router-dom
 */
export const redirectByRole = (userData, navigate) => {
  if (!userData) {
    // Fallback: redirigir a dashboard por defecto
    navigate('/dashboard');
    return;
  }

  // Obtener role_id y postulant_status del usuario
  // Puede venir directamente del usuario o de roleData (compatibilidad con código anterior)
  const roleId = userData.role_id || userData.user?.role_id;
  const postulantStatus = userData.postulant_status || userData.user?.postulant_status;
  
  // Compatibilidad con formato anterior (is_admin, role_slug, etc.)
  const isAdmin = roleId === 2 || userData.is_admin || userData.role_slug === 'admin';
  const isPostulante = roleId === 1 || userData.is_postulante || userData.role_slug === 'postulante';

  // Paso 1: Verificar si es Admin
  if (isAdmin || roleId === 2) {
    // Admin → Dashboard de Admin
    navigate('/dashboard');
    return;
  }

  // Paso 2: Si es Postulante, verificar estado
  if (isPostulante || roleId === 1) {
    // Si no tiene postulant_status o es null/undefined, redirigir a selección de convocatoria
    if (postulantStatus === null || postulantStatus === undefined || postulantStatus === 0) {
      navigate('/seleccion-practicantes/seleccionar-convocatoria');
      return;
    }

    switch (postulantStatus) {
      case 3:
        // Aceptado → Dashboard de Postulante (con acceso completo)
        navigate('/seleccion-practicantes');
        break;
        
      case 2:
        // En proceso → Continuar con formularios/encuestas
        navigate('/seleccion-practicantes/postulacion');
        break;
        
      case 1:
      default:
        // No aplicado o primera vez → Seleccionar convocatoria primero
        navigate('/seleccion-practicantes/seleccionar-convocatoria');
        break;
    }
    return;
  }

  // Fallback: redirigir a dashboard por defecto
  navigate('/dashboard');
};

