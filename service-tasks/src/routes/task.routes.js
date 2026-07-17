const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const { createTask, getTasks } = require('../controllers/task.controller');

router.post('/', authMiddleware, createTask);
router.get('/', authMiddleware, getTasks);

module.exports = router;
