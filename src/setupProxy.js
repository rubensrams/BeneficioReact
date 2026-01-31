const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/proxy-api',
    createProxyMiddleware({
      target: 'https://091402bq105.prfd.infonavit.net:4320',
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        '^/proxy-api': '/INFONAVIT/public/MCI/XS'
      }
    })
  );
  
  console.log('✅ Proxy configurado: /proxy-api -> https://091402bq105.prfd.infonavit.net:4320');
};
