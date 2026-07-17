const app = require('./app');
const connectDatabase = require('../configs/database');
const environment = require('../configs/environment');

async function startServer() {
  await connectDatabase();

  app.listen(environment.port, () => {
    console.log(`[service-auth] Servidor escuchando en http://localhost:${environment.port}`);
  });
}

startServer();
