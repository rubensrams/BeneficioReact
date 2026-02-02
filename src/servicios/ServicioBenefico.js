import { post } from './HttpService';
import { getBasicAuthHeader, transformarRespuestaBeneficio } from '../helper/HelperBeneficio';

const DIRECT_URL = 'https://091402bq105.prfd.infonavit.net:4320/INFONAVIT/public/MCI/XS/PostISI.xsjs';

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
        //IP_NOMBRE: nombre || "",
        //IP_FH_NACIMIENTO: fecha || "",
        //IP_NSS: nss || "",
        IP_CREDITO: credito
      });
      const resp = await response.json();
      console.log('Respuesta original:', resp);
      
      const datosTransformados = transformarRespuestaBeneficio(resp);
      
      console.log('Respuesta transformada:', datosTransformados);
      return datosTransformados;
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
