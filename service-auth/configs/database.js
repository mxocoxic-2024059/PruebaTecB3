const mongoose = require('mongoose');
const environment = require('./environment');

async function connectDatabase() {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(environment.mongoUri);
    console.log(`[service-auth] Conectado a MongoDB -> ${environment.mongoUri}`);
  } catch (error) {
    console.error('[service-auth] Error al conectar con MongoDB:', error.message);
    process.exit(1);
  }
}

module.exports = connectDatabase;
