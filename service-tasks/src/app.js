require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const taskRoutes = require('./routes/task.routes');

const app = express();
const PORT = process.env.PORT || 4001;

// Middlewares
app.use(cors());
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
