// =======================================================
//  CONFIGURACIÓN BASE
// =======================================================

const API_URL = 'http://127.0.0.1:8000/api/';

// =======================================================
//  MÉTODOS HTTP BASE (GET y POST)
// =======================================================

export const get = async (endpoint) => {
  try {
    const response = await fetch(API_URL + endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error GET ${endpoint}: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('GET ERROR:', error);
    throw error;
  }
};

export const post = async (endpoint, data) => {
  try {
    const response = await fetch(API_URL + endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error POST ${endpoint}: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('POST ERROR:', error);
    throw error;
  }
};

// =======================================================
//  SERVICIOS DEL BOT
// =======================================================

// POST → Enviar métricas
export const enviarMetricasBot = async (data) => {
  return await post('bot/metricas/', data);
};

// GET → Resumen
export const obtenerResumenBot = async () => {
  return await get('bot/resumen/');
};

// GET → Estado
export const obtenerEstadoBot = async () => {
  return await get('bot/estado/');
};

// GET → Servidores
export const obtenerServidoresBot = async () => {
  return await get('bot/servers/');
};

// POST → Cambiar estado
export const actualizarEstadoBot = async (data) => {
  if (!data?.status) {
    throw new Error('El campo "status" es obligatorio');
  }
  return await post('bot/status/', data);
};

// =======================================================
//  WEBSOCKET
// =======================================================

export const conectarWebSocketBot = () => {
  return new WebSocket('ws://127.0.0.1:8000/ws/bot/metrics/');
};