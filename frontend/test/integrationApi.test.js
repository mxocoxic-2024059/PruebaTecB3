import test from 'node:test';
import assert from 'node:assert/strict';
import { login, register } from '../src/api/authApi.js';
import { createTask, getTasks } from '../src/api/tasksApi.js';
import { getDashboard } from '../src/api/productivityApi.js';
import { ApiError } from '../src/api/httpClient.js';
import { persistSession, SESSION_TOKEN_KEY, SESSION_USER_KEY } from '../src/utils/session.js';
import { buildTaskPayload } from '../src/utils/taskPayload.js';
import { refreshTaskResources, runTaskMutation } from '../src/utils/taskRefresh.js';

class MemoryStorage {
  #values = new Map();
  getItem(key) { return this.#values.has(key) ? this.#values.get(key) : null; }
  setItem(key, value) { this.#values.set(key, String(value)); }
  removeItem(key) { this.#values.delete(key); }
}

function jsonResponse(body, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    text: async () => JSON.stringify(body),
  };
}

function installBrowserGlobals(context) {
  const previous = {
    fetch: global.fetch,
    sessionStorage: global.sessionStorage,
    window: global.window,
  };
  const storage = new MemoryStorage();
  global.sessionStorage = storage;
  global.window = new EventTarget();
  context.after(() => {
    global.fetch = previous.fetch;
    global.sessionStorage = previous.sessionStorage;
    global.window = previous.window;
  });
  return storage;
}

test('registro envía exclusivamente nombre, correo y contrasena', async (context) => {
  installBrowserGlobals(context);
  let request;
  global.fetch = async (url, options) => {
    request = { url, options };
    return jsonResponse({ success: true, data: { user: { _id: 'user-1' } } }, 201);
  };

  await register({ nombre: 'Ada', correo: 'ada@example.com', contrasena: 'segura123' });
  assert.equal(request.url, 'http://localhost:4001/auth/register');
  assert.deepEqual(JSON.parse(request.options.body), {
    nombre: 'Ada',
    correo: 'ada@example.com',
    contrasena: 'segura123',
  });
});

test('login consume data.token y data.user y permite iniciar sesión', async (context) => {
  const storage = installBrowserGlobals(context);
  const response = {
    success: true,
    data: {
      token: 'jwt-redacted',
      user: { _id: 'user-1', nombre: 'Ada', correo: 'ada@example.com' },
    },
  };
  global.fetch = async () => jsonResponse(response);

  persistSession(await login({ correo: 'ada@example.com', contrasena: 'segura123' }), storage);
  assert.equal(storage.getItem(SESSION_TOKEN_KEY), 'jwt-redacted');
  assert.deepEqual(JSON.parse(storage.getItem(SESSION_USER_KEY)), response.data.user);
});

test('401 protegido elimina la sesión y emite el evento de expiración', async (context) => {
  const storage = installBrowserGlobals(context);
  storage.setItem(SESSION_TOKEN_KEY, 'jwt-redacted');
  storage.setItem(SESSION_USER_KEY, JSON.stringify({ _id: 'user-1' }));
  let unauthorizedEvents = 0;
  global.window.addEventListener('taskflow:unauthorized', () => { unauthorizedEvents += 1; });
  global.fetch = async () => jsonResponse({ mensaje: 'Token inválido o expirado' }, 401);

  await assert.rejects(getTasks(), (error) => error instanceof ApiError && error.status === 401);
  assert.equal(storage.getItem(SESSION_TOKEN_KEY), null);
  assert.equal(storage.getItem(SESSION_USER_KEY), null);
  assert.equal(unauthorizedEvents, 1);
});

test('Tasks lista datos reales y adjunta Authorization', async (context) => {
  const storage = installBrowserGlobals(context);
  storage.setItem(SESSION_TOKEN_KEY, 'jwt-redacted');
  let authorization;
  const tasks = [{ _id: 'task-1', titulo: 'Integrar servicios', estado: 'pendiente' }];
  global.fetch = async (_url, options) => {
    authorization = options.headers.Authorization;
    return jsonResponse(tasks);
  };

  assert.deepEqual(await getTasks(), tasks);
  assert.equal(authorization, 'Bearer jwt-redacted');
});

test('Tasks y Productivity normalizan la indisponibilidad sin filtrar errores técnicos', async (context) => {
  const storage = installBrowserGlobals(context);
  storage.setItem(SESSION_TOKEN_KEY, 'jwt-redacted');
  global.fetch = async () => { throw new TypeError('Failed to fetch'); };

  await assert.rejects(getTasks(), (error) => (
    error instanceof ApiError && error.message === 'No fue posible conectar con el servicio.'
  ));
  await assert.rejects(getDashboard(), (error) => (
    error instanceof ApiError && error.message === 'No fue posible conectar con el servicio.'
  ));
});

test('creación envía solo el body permitido y actualiza Tasks y Productivity', async (context) => {
  const storage = installBrowserGlobals(context);
  storage.setItem(SESSION_TOKEN_KEY, 'jwt-redacted');
  const payload = buildTaskPayload({
    titulo: '  Integrar frontend  ',
    descripcion: '  Validar contratos  ',
    prioridad: 'alta',
    estado: 'en_progreso',
    fecha: '2026-07-20',
    usuarioId: 'prohibido',
    _id: 'prohibido',
  });
  let requestBody;
  global.fetch = async (_url, options) => {
    requestBody = JSON.parse(options.body);
    return jsonResponse({ _id: 'task-1', ...requestBody }, 201);
  };
  const calls = [];

  const mutation = await runTaskMutation(
    () => createTask(payload),
    () => refreshTaskResources(
      async () => { calls.push('tasks'); },
      async () => { calls.push('dashboard'); },
    ),
  );

  assert.deepEqual(requestBody, {
    titulo: 'Integrar frontend',
    descripcion: 'Validar contratos',
    prioridad: 'alta',
    estado: 'en_progreso',
    fecha: '2026-07-20',
  });
  assert.deepEqual(calls.sort(), ['dashboard', 'tasks']);
  assert.equal(mutation.refreshResult.tasksUpdated, true);
  assert.equal(mutation.refreshResult.dashboardUpdated, true);
});

test('Productivity devuelve las métricas reales del dashboard', async (context) => {
  const storage = installBrowserGlobals(context);
  storage.setItem(SESSION_TOKEN_KEY, 'jwt-redacted');
  const metrics = {
    total: 3,
    completadas: 1,
    enProgreso: 1,
    pendientes: 1,
    vencidas: 1,
    porcentajeFinalizacion: 33,
  };
  global.fetch = async () => jsonResponse({ success: true, data: metrics });

  assert.deepEqual((await getDashboard()).data, metrics);
});
