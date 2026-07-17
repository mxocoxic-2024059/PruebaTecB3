const express = require('express');
const cors = require('cors');
const environment = require('../configs/environment');
const authRoutes = require('./auth/auth.routes');
const notFoundMiddleware = require('../middlewares/not-found.middleware');
const errorMiddleware = require('../middlewares/error.middleware');

const app = express();

app.use(cors({ origin: environment.corsOrigin }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.status(200).json({ success: true, service: 'service-auth', status: 'up' });
});

app.use('/auth', authRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

module.exports = app;
