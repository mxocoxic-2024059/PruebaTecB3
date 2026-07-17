const test = require('node:test');
const assert = require('node:assert/strict');
const {
  calculateDashboard,
  fetchTasks,
  TasksUnavailableError,
} = require('../src/services/dashboard.service');

const NOW = new Date('2026-07-17T15:00:00.000Z');

test('calcula cero tareas', () => {
  assert.deepEqual(calculateDashboard([], NOW), {
    total: 0,
    completadas: 0,
    enProgreso: 0,
    pendientes: 0,
    vencidas: 0,
    porcentajeFinalizacion: 0,
  });
});

test('calcula estados y porcentaje de finalización', () => {
  const result = calculateDashboard([
    { estado: 'pendiente' },
    { estado: 'en_progreso' },
    { estado: 'completada' },
    { estado: 'completada' },
  ], NOW);

  assert.equal(result.total, 4);
  assert.equal(result.pendientes, 1);
  assert.equal(result.enProgreso, 1);
  assert.equal(result.completadas, 2);
  assert.equal(result.porcentajeFinalizacion, 50);
});

test('cuenta una tarea pendiente con fecha pasada como vencida', () => {
  const result = calculateDashboard([{ estado: 'pendiente', fecha: '2026-07-16T23:59:00.000Z' }], NOW);
  assert.equal(result.vencidas, 1);
});

test('no considera vencida una tarea con fecha de hoy', () => {
  const result = calculateDashboard([{ estado: 'pendiente', fecha: '2026-07-17T00:00:00.000Z' }], NOW);
  assert.equal(result.vencidas, 0);
});

test('no considera vencida una tarea completada con fecha pasada', () => {
  const result = calculateDashboard([{ estado: 'completada', fecha: '2026-07-01T00:00:00.000Z' }], NOW);
  assert.equal(result.vencidas, 0);
});

test('reenvía exactamente el header Authorization a Tasks', async () => {
  let receivedOptions;
  const tasks = [{ estado: 'pendiente' }];
  const fakeFetch = async (_url, options) => {
    receivedOptions = options;
    return { ok: true, status: 200, json: async () => tasks };
  };

  const result = await fetchTasks('http://localhost:4002', 'Bearer token-redacted', fakeFetch);
  assert.deepEqual(result, tasks);
  assert.deepEqual(receivedOptions.headers, { Authorization: 'Bearer token-redacted' });
});

test('normaliza como indisponibilidad cuando Tasks no responde', async () => {
  const unavailableFetch = async () => { throw new Error('network down'); };
  await assert.rejects(
    fetchTasks('http://localhost:4002', 'Bearer token-redacted', unavailableFetch),
    TasksUnavailableError,
  );
});
