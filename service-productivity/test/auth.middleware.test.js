const test = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');
const { createAuthMiddleware } = require('../src/middleware/auth.middleware');

const TEST_KEY = 'local-test-key-not-used-outside-tests';

function invoke(authorization) {
  const middleware = createAuthMiddleware(TEST_KEY);
  const req = { headers: authorization ? { authorization } : {} };
  const result = { status: null, body: null, nextCalled: false };
  const res = {
    status(code) { result.status = code; return this; },
    json(body) { result.body = body; return this; },
  };

  middleware(req, res, () => { result.nextCalled = true; });
  result.user = req.user;
  return result;
}

test('rechaza token ausente', () => {
  const result = invoke();
  assert.equal(result.status, 401);
  assert.equal(result.body.message, 'Token inválido o expirado');
});

test('acepta HS256 con sub y normaliza el usuario', () => {
  const token = jwt.sign({ sub: 'user-id', correo: 'user@example.com', nombre: 'User' }, TEST_KEY, {
    algorithm: 'HS256',
    expiresIn: '5m',
  });
  const result = invoke(`Bearer ${token}`);

  assert.equal(result.nextCalled, true);
  assert.deepEqual(result.user, { id: 'user-id', correo: 'user@example.com', nombre: 'User' });
});

test('rechaza JWT con algoritmo no permitido', () => {
  const token = jwt.sign({ sub: 'user-id' }, TEST_KEY, { algorithm: 'HS384', expiresIn: '5m' });
  const result = invoke(`Bearer ${token}`);
  assert.equal(result.status, 401);
});

test('rechaza JWT sin sub', () => {
  const token = jwt.sign({ correo: 'user@example.com' }, TEST_KEY, { algorithm: 'HS256', expiresIn: '5m' });
  const result = invoke(`Bearer ${token}`);
  assert.equal(result.status, 401);
});
