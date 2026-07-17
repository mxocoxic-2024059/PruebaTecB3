import test from 'node:test';
import assert from 'node:assert/strict';
import { filterTasks, formatDate, isOverdue } from '../src/utils/tasks.js';

const NOW = new Date('2026-07-17T18:00:00.000Z');

test('detecta vencimiento comparando la fecha UTC', () => {
  assert.equal(isOverdue({ estado: 'pendiente', fecha: '2026-07-16T23:59:00.000Z' }, NOW), true);
  assert.equal(isOverdue({ estado: 'pendiente', fecha: '2026-07-17T00:00:00.000Z' }, NOW), false);
  assert.equal(isOverdue({ estado: 'completada', fecha: '2026-07-01T00:00:00.000Z' }, NOW), false);
});

test('filtra por estado y vencidas', () => {
  const tasks = [
    { estado: 'pendiente', fecha: '2026-07-10' },
    { estado: 'en_progreso', fecha: '2026-07-20' },
    { estado: 'completada', fecha: '2026-07-01' },
  ];
  assert.equal(filterTasks(tasks, 'pendiente', NOW).length, 1);
  assert.equal(filterTasks(tasks, 'en_progreso', NOW).length, 1);
  assert.equal(filterTasks(tasks, 'vencidas', NOW).length, 1);
});

test('formatea fechas sin desfase de zona horaria', () => {
  assert.equal(formatDate('2026-07-17T00:00:00.000Z'), '17/07/2026');
  assert.equal(formatDate(null), 'Sin fecha');
});
