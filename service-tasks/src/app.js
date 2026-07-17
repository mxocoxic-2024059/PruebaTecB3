require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const taskRoutes = require('./routes/task.routes');

const app = express();
const PORT = process.env.PORT || 4002;
const corsOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

if (!process.env.JWT_SECRET) {
  throw new Error('[service-tasks] JWT_SECRET es obligatorio para iniciar el servicio.');
}

// Middlewares
app.use(cors({ origin: corsOrigins }));
app.use(express.json());

// Conectar a MongoDB
connectDB();

// Health endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Task routes
app.use('/tasks', taskRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Servicio de Tareas corriendo en el puerto ${PORT}`);
});
