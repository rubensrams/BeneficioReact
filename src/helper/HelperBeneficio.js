// Credenciales para llamadas directas
const DIRECT_USERNAME = 'AP_MCI';
const DIRECT_PASSWORD = 'PaSsw0rd21#';

/**
 * Genera el header de autenticación Basic
 * @returns {string} Header de autenticación Basic
 */
export const getBasicAuthHeader = () => {
  const credentials = btoa(`${DIRECT_USERNAME}:${DIRECT_PASSWORD}`);
  return `Basic ${credentials}`;
};

/**
 * Transforma la respuesta del API a un objeto con propiedades accesibles
 * @param {Array|Object} response - Respuesta del API (array con 1 elemento o objeto)
 * @returns {Object} Objeto transformado con propiedades accesibles
 */
export const transformarRespuestaBeneficio = (response) => {
  // Extraer el primer elemento si es array (siempre viene 1 solo elemento)
  const data = Array.isArray(response) ? response[0] : response;
  
  return {
    nombre: data?.tx_Nombre_Pila || data?.tx_Nombre_Mascara || '',
    numeroCredito: data?.credito || '',
    fechaCongelacion: data?.fecha_Congelacion || data?.fechaCongelacion || '',
    saldoAntes: data?.saldo_Orig || '',
    saldoDespues: data?.saldo_Isi || '',
    fechaAplicacion: data?.fecha_Aplicacion || data?.fechaAplicacion || '',
    // Propiedades adicionales disponibles
    factorOrig: data?.factor_Orig || '',
    factorIsi: data?.factor_Isi || '',
    tasaOrig: data?.tasa_Orig || '',
    tasaIsi: data?.tasa_Isi || '',
    plazoOrig: data?.plazo_Orig || '',
    plazoIsi: data?.plazo_Isi || '',
    montoPagPrev: data?.monto_Pag_Prev || '',
    montoPagIsi: data?.monto_Pag_Isi || '',
    agrupadorEscenario: data?.tx_Agrupador_Escenario || '',
    grupo: data?.grupo || ''
  };
};

/**
 * Formatea un número como moneda con comas y 2 decimales
 * @param {number|string} valor - El valor a formatear
 * @returns {string} Valor formateado (ej: "609,079.53")
 */
export const formatearMoneda = (valor) => {
  if (!valor && valor !== 0) return '0.00';
  const numero = typeof valor === 'string' ? parseFloat(valor) : valor;
  return numero.toLocaleString('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};
