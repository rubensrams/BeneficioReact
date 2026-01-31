/**
 * Servicio HTTP reutilizable para llamadas a APIs
 * Maneja autenticación, headers comunes y errores de forma centralizada
 */

// Configuración base
const config = {
  // En desarrollo usa el proxy local, en producción la URL directa
  baseURL: process.env.NODE_ENV === 'development' 
    ? '/proxy-api' 
    : 'https://091402bq105.prfd.infonavit.net:4320/INFONAVIT/public/MCI/XS',
  username: 'AP_MCI',
  password: 'PaSsw0rd21#',
  timeout: 10000, // 10 segundos
};

/**
 * Genera el header de autenticación Basic
 * @returns {string} Header de autorización en formato Basic
 */
const getBasicAuthHeader = () => {
  const credentials = btoa(`${config.username}:${config.password}`);
  return `Basic ${credentials}`;
};

/**
 * Crea los headers comunes para todas las peticiones
 * @param {Object} customHeaders - Headers adicionales personalizados
 * @returns {Object} Headers configurados
 */
const getHeaders = (customHeaders = {}) => {
  return {
    'Content-Type': 'application/json',
    'Authorization': getBasicAuthHeader(),
    ...customHeaders
  };
};

/**
 * Realiza una petición POST
 * @param {string} endpoint - Ruta del endpoint (se concatena con baseURL)
 * @param {Object} body - Cuerpo de la petición
 * @param {Object} options - Opciones adicionales (headers, timeout, etc.)
 * @returns {Promise<Object>} Respuesta del servidor
 */
export const post = async (endpoint, body = {}, options = {}) => {
    console.log("Usando endpoint " + endpoint)
  const url = `${config.baseURL}${endpoint}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeout || config.timeout);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(options.headers),
      body: JSON.stringify(body),
      signal: controller.signal,
      // NOTA: En navegadores, NO se puede desactivar la validación SSL
      // Para desarrollo, usa Chrome con flag: chrome.exe --ignore-certificate-errors
      // Para producción, configura certificados válidos en el servidor
    });

    clearTimeout(timeoutId);

    // Verificar si la respuesta fue exitosa
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        status: response.status,
        statusText: response.statusText,
        data: errorData,
        message: errorData.message || `Error ${response.status}: ${response.statusText}`
      };
    }

    return response;  
    
   } catch (error) {
    clearTimeout(timeoutId);
    
    // Manejar diferentes tipos de errores
    if (error.name === 'AbortError') {
      throw {
        status: 408,
        message: 'La petición ha excedido el tiempo de espera',
        type: 'TIMEOUT'
      };
    }

    if (error.message === 'Failed to fetch' || error.message.includes('ERR_CERT')) {
      throw {
        status: 0,
        message: 'Error de conexión o certificado SSL. Verifica la URL o configura el certificado.',
        type: 'CONNECTION_ERROR',
        originalError: error
      };
    }

    // Si ya es un error formateado, lanzarlo tal cual
    if (error.status) {
      throw error;
    }

    // Error desconocido
    throw {
      status: 500,
      message: error.message || 'Error desconocido en la petición',
      type: 'UNKNOWN_ERROR',
      originalError: error
    };
  }
};

/**
 * Realiza una petición GET
 * @param {string} endpoint - Ruta del endpoint
 * @param {Object} options - Opciones adicionales
 * @returns {Promise<Object>} Respuesta del servidor
 */
export const get = async (endpoint, options = {}) => {
  const url = `${config.baseURL}${endpoint}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeout || config.timeout);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(options.headers),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        status: response.status,
        statusText: response.statusText,
        data: errorData,
        message: errorData.message || `Error ${response.status}: ${response.statusText}`
      };
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw {
        status: 408,
        message: 'La petición ha excedido el tiempo de espera',
        type: 'TIMEOUT'
      };
    }

    if (error.message === 'Failed to fetch' || error.message.includes('ERR_CERT')) {
      throw {
        status: 0,
        message: 'Error de conexión o certificado SSL. Verifica la URL o configura el certificado.',
        type: 'CONNECTION_ERROR',
        originalError: error
      };
    }

    if (error.status) {
      throw error;
    }

    throw {
      status: 500,
      message: error.message || 'Error desconocido en la petición',
      type: 'UNKNOWN_ERROR',
      originalError: error
    };
  }
};

/**
 * Actualiza la configuración base
 * @param {Object} newConfig - Nueva configuración
 */
export const updateConfig = (newConfig) => {
  Object.assign(config, newConfig);
};

/**
 * Obtiene la configuración actual
 * @returns {Object} Configuración actual
 */
export const getConfig = () => ({ ...config });

// Exportar como default
export default {
  post,
  get,
  updateConfig,
  getConfig
};
