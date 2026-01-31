# Solución al error ERR_CERT_AUTHORITY_INVALID

## ⚠️ Problema de Certificados SSL

El navegador no permite ignorar certificados SSL inválidos mediante código JavaScript por razones de seguridad.

## 🔧 Soluciones

### 1. **Para Desarrollo Local (Temporal)**

#### Chrome:
Ejecuta Chrome con el flag que ignora errores de certificado:

**Windows:**
```bash
chrome.exe --ignore-certificate-errors --ignore-urlfetcher-cert-requests --user-data-dir=C:\temp\chrome_dev
```

**Mac:**
```bash
open -a Google\ Chrome --args --ignore-certificate-errors --ignore-urlfetcher-cert-requests --user-data-dir=/tmp/chrome_dev
```

**Linux:**
```bash
google-chrome --ignore-certificate-errors --ignore-urlfetcher-cert-requests --user-data-dir=/tmp/chrome_dev
```

#### Edge:
```bash
msedge.exe --ignore-certificate-errors --user-data-dir=C:\temp\edge_dev
```

### 2. **Proxy Local (Desarrollo - Recomendado)**

Crea un archivo `setupProxy.js` en la carpeta `src/` (Create React App automáticamente lo detecta):

```javascript
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://091402bq105.prfd.infonavit.net:4320',
      changeOrigin: true,
      secure: false, // Ignora certificados SSL
      pathRewrite: {
        '^/api': '/INFONAVIT/public/MCI/XS'
      }
    })
  );
};
```

Instala la dependencia:
```bash
npm install http-proxy-middleware --save-dev
```

Actualiza `HttpService.js` para usar el proxy en desarrollo:
```javascript
const config = {
  baseURL: process.env.NODE_ENV === 'development' 
    ? '/api' 
    : 'https://091402bq105.prfd.infonavit.net:4320/INFONAVIT/public/MCI/XS',
  // ...resto de la configuración
};
```

### 3. **Para Producción (Correcto)**

- Instalar un certificado SSL válido en el servidor
- Usar certificados de una CA reconocida (Let's Encrypt, etc.)
- Configurar correctamente el servidor para HTTPS

### 4. **Backend Intermedio**

Crear un backend en Node.js que maneje las peticiones y omita la validación SSL:

```javascript
// server.js
const express = require('express');
const https = require('https');
const app = express();

const agent = new https.Agent({
  rejectUnauthorized: false // Solo para desarrollo
});

app.post('/api/beneficio', async (req, res) => {
  const response = await fetch('https://...', {
    agent,
    // ... resto de opciones
  });
  res.json(await response.json());
});
```

## 📝 Recomendación

Para desarrollo, usa la **opción 2 (Proxy Local)** ya que es la más limpia y no requiere modificar la configuración del navegador cada vez.
