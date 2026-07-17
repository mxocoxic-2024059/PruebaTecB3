const app = require('./app');
const environment = require('./config/environment');

app.listen(environment.port, () => {
  console.log(`[service-productivity] Servidor escuchando en el puerto ${environment.port}`);
});
