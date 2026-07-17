import test from 'node:test';
import assert from 'node:assert/strict';
import { apiRequest, ApiError } from '../src/api/httpClient.js';

test('normaliza un fallo de conexión sin exponer el error técnico', async (context) => {
  const originalFetch = global.fetch;
  context.after(() => { global.fetch = originalFetch; });
  global.fetch = async () => { throw new Error('Failed to fetch'); };

  await assert.rejects(
    apiRequest('http://localhost:9999', '/test'),
    (error) => error instanceof ApiError && error.message === 'No fue posible conectar con el servicio.',
  );
});

test('parsea correctamente una respuesta exitosa sin body', async (context) => {
  const originalFetch = global.fetch;
  context.after(() => { global.fetch = originalFetch; });
  global.fetch = async () => ({ ok: true, text: async () => '' });

  assert.equal(await apiRequest('http://localhost:9999', '/test'), null);
});
