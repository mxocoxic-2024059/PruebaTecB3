const jwt = require('jsonwebtoken');

const payload = {
  userId: '507f1f77bcf86cd799439011',
  email: 'test@example.com'
};

const token = jwt.sign(payload, 'test_secret', { expiresIn: '1h' });
console.log('Tu token es:');
console.log(token);
console.log('\nCopia este token y úsalo en el header Authorization: Bearer <token>');
