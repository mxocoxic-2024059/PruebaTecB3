import test from 'node:test';
import assert from 'node:assert/strict';
import { getInitialTheme, persistTheme, THEME_STORAGE_KEY } from '../src/utils/theme.js';

class MemoryStorage {
  #values = new Map();
  getItem(key) { return this.#values.has(key) ? this.#values.get(key) : null; }
  setItem(key, value) { this.#values.set(key, String(value)); }
}

test('el tema guardado prevalece sobre la preferencia del sistema', () => {
  const storage = new MemoryStorage();
  storage.setItem(THEME_STORAGE_KEY, 'light');
  assert.equal(getInitialTheme(storage, true), 'light');
});

test('el tema oscuro se persiste y puede restaurarse', () => {
  const storage = new MemoryStorage();
  persistTheme('dark', storage);
  assert.equal(storage.getItem(THEME_STORAGE_KEY), 'dark');
  assert.equal(getInitialTheme(storage, false), 'dark');
});
