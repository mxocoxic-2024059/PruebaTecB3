import test from 'node:test';
import assert from 'node:assert/strict';
import {
  clearStoredSession,
  persistSession,
  readStoredSession,
  SESSION_TOKEN_KEY,
  SESSION_USER_KEY,
} from '../src/utils/session.js';

class MemoryStorage {
  #values = new Map();

  getItem(key) {
    return this.#values.has(key) ? this.#values.get(key) : null;
  }

  setItem(key, value) {
    this.#values.set(key, String(value));
  }

  removeItem(key) {
    this.#values.delete(key);
  }
}

const authResponse = {
  data: {
    token: 'jwt-redacted',
    user: { _id: 'user-1', nombre: 'Ada Lovelace', correo: 'ada@example.com' },
  },
};

test('login persiste el token y el usuario del contrato real', () => {
  const storage = new MemoryStorage();
  const session = persistSession(authResponse, storage);

  assert.equal(storage.getItem(SESSION_TOKEN_KEY), 'jwt-redacted');
  assert.deepEqual(JSON.parse(storage.getItem(SESSION_USER_KEY)), authResponse.data.user);
  assert.deepEqual(session, authResponse.data);
});

test('logout elimina por completo la sesión', () => {
  const storage = new MemoryStorage();
  persistSession(authResponse, storage);
  clearStoredSession(storage);

  assert.deepEqual(readStoredSession(storage), { token: null, user: null });
});

test('una sesión incompleta se rechaza y se limpia', () => {
  const storage = new MemoryStorage();
  storage.setItem(SESSION_TOKEN_KEY, 'jwt-redacted');

  assert.deepEqual(readStoredSession(storage), { token: null, user: null });
  assert.equal(storage.getItem(SESSION_TOKEN_KEY), null);
});
