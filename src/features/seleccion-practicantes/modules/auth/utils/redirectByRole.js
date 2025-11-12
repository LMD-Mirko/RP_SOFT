/**
 * Función helper para redirigir según el rol del usuario
 * @param {Object} roleData - Datos del rol del usuario
 * @param {Function} navigate - Función de navegación de react-router-dom
 */
export const redirectByRole = (roleData, navigate) => {
  if (!roleData) {
    // Fallback: redirigir a dashboard por defecto
    navigate('/dashboard');
    return;
  }

  const isAdmin = roleData.is_admin || roleData.role_slug === 'admin';
  const isPostulante = roleData.is_postulante || roleData.role_slug === 'postulante';

  if (isAdmin) {
    navigate('/dashboard');
  } else if (isPostulante) {
    navigate('/seleccion-practicantes/postulacion');
  } else {
    // Fallback: redirigir a dashboard por defecto
    navigate('/dashboard');
  }
};

