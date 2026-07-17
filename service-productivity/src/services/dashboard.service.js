class TasksUnavailableError extends Error {}
class InvalidTasksTokenError extends Error {}

function toUtcDatePart(value) {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return date.toISOString().slice(0, 10);
}

function calculateDashboard(tasks, now = new Date()) {
  const today = now.toISOString().slice(0, 10);
  const total = tasks.length;
  const completadas = tasks.filter((task) => task.estado === 'completada').length;
  const enProgreso = tasks.filter((task) => task.estado === 'en_progreso').length;
  const pendientes = tasks.filter((task) => task.estado === 'pendiente').length;
  const vencidas = tasks.filter((task) => {
    const dueDate = toUtcDatePart(task.fecha);
    return task.estado !== 'completada' && dueDate !== null && dueDate < today;
  }).length;

  return {
    total,
    completadas,
    enProgreso,
    pendientes,
    vencidas,
    porcentajeFinalizacion: total === 0 ? 0 : Math.round((completadas / total) * 100),
  };
}

async function fetchTasks(tasksServiceUrl, authorization, fetchImpl = fetch, timeoutMs = 5000) {
  let response;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    response = await fetchImpl(`${tasksServiceUrl}/tasks`, {
      headers: { Authorization: authorization },
      signal: controller.signal,
    });
  } catch {
    throw new TasksUnavailableError();
  } finally {
    clearTimeout(timeout);
  }

  if (response.status === 401) {
    throw new InvalidTasksTokenError();
  }

  if (!response.ok) {
    throw new TasksUnavailableError();
  }

  try {
    const tasks = await response.json();
    if (!Array.isArray(tasks)) throw new Error('Invalid tasks response');
    return tasks;
  } catch {
    throw new TasksUnavailableError();
  }
}

async function getDashboard(tasksServiceUrl, authorization, options = {}) {
  const tasks = await fetchTasks(
    tasksServiceUrl,
    authorization,
    options.fetchImpl,
    options.timeoutMs,
  );
  return calculateDashboard(tasks, options.now);
}

module.exports = {
  InvalidTasksTokenError,
  TasksUnavailableError,
  calculateDashboard,
  fetchTasks,
  getDashboard,
  toUtcDatePart,
};
