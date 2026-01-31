import { post } from './HttpService';

// Credenciales para llamadas directas
const DIRECT_USERNAME = 'AP_MCI';
const DIRECT_PASSWORD = 'PaSsw0rd21#';
const DIRECT_URL = 'https://091402bq105.prfd.infonavit.net:4320/INFONAVIT/public/MCI/XS/PostISI.xsjs';

/**
 * Genera el header de autenticación Basic
 */
const getBasicAuthHeader = () => {
  const credentials = btoa(`${DIRECT_USERNAME}:${DIRECT_PASSWORD}`);
  return `Basic ${credentials}`;
};

/**
 * Servicio de Beneficios - Consultas de información del Infonavit
 */
export const ServicioBenefico = {

  /**
   * Consulta beneficio usando el proxy (recomendado para desarrollo)
   */
  consultarWSBeneficioDesa: async (opcion, nombre, fecha, nss, credito) => {
    console.log('Consultando vía proxy:', { opcion, nombre, fecha, nss, credito });
    try {
      const response = await post('/PostISI.xsjs', {
        IP_NOMBRE: nombre || "",
        IP_FH_NACIMIENTO: fecha || "",
        IP_NSS: nss || "",
        IP_CREDITO: credito || ""
      });
      console.log('Respuesta:', response);
      return await response.json();
    } catch (error) {
      console.error('Error consultando vía proxy:', error);
      throw error;
    }
  },

  /**
   * Consulta beneficio SIN usar proxy (conexión directa al servidor)
   * ADVERTENCIA: Puede fallar por error de certificado SSL en desarrollo
   */
  consultarWSBeneficio: async (opcion, nombre, fecha, nss, credito) => {
    console.log('Consultando directamente (sin proxy):', { opcion, nombre, fecha, nss, credito });
    
    try {
      const response = await fetch(DIRECT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getBasicAuthHeader()
        },
        body: JSON.stringify({
          IP_NOMBRE: nombre || "",
          IP_FH_NACIMIENTO: fecha || "",
          IP_NSS: nss || "",
          IP_CREDITO: credito || ""
        })
      });

      if (!response.ok) {
        throw {
          status: response.status,
          statusText: response.statusText,
          message: `Error ${response.status}: ${response.statusText}`
        };
      }
        const data = await response.json();
        console.log('Respuesta directa:', data);
        return data;
    } catch (error) {
        console.error('Error consultando directo:', error);
        throw error;
    }
  }
};
