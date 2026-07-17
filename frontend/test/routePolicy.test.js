import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getGuestRedirect,
  getHomeDestination,
  getProtectedRedirect,
} from '../src/routes/routePolicy.js';

test('una ruta privada redirige al login sin sesión y conserva el destino', () => {
  assert.deepEqual(getProtectedRedirect(false, '/tasks', 'Sesión expirada'), {
    to: '/login',
    state: { from: '/tasks', message: 'Sesión expirada' },
  });
  assert.equal(getProtectedRedirect(true, '/tasks'), null);
});

test('las rutas públicas y la raíz respetan el estado autenticado', () => {
  assert.equal(getGuestRedirect(true), '/dashboard');
  assert.equal(getGuestRedirect(false), null);
  assert.equal(getHomeDestination(true), '/dashboard');
  assert.equal(getHomeDestination(false), '/login');
});
