const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error('MONGODB_URI no está definida en las variables de entorno');
      process.exit(1);
    }
    
    await mongoose.connect(uri);
    console.log('MongoDB conectado exitosamente');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
