export function utcDatePart(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}

export function isOverdue(task, now = new Date()) {
  const dueDate = utcDatePart(task.fecha);
  return task.estado !== 'completada' && dueDate !== null && dueDate < now.toISOString().slice(0, 10);
}

export function filterTasks(tasks, filter, now = new Date()) {
  if (filter === 'todas') return tasks;
  if (filter === 'vencidas') return tasks.filter((task) => isOverdue(task, now));
  return tasks.filter((task) => task.estado === filter);
}

export function sortUpcomingTasks(tasks) {
  return [...tasks]
    .filter((task) => task.estado !== 'completada')
    .sort((a, b) => {
      if (!a.fecha) return 1;
      if (!b.fecha) return -1;
      return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
    });
}

export function formatDate(value) {
  const datePart = utcDatePart(value);
  if (!datePart) return 'Sin fecha';
  const [year, month, day] = datePart.split('-');
  return `${day}/${month}/${year}`;
}

export const statusLabels = {
  pendiente: 'Pendiente',
  en_progreso: 'En progreso',
  completada: 'Completada',
};

export const priorityLabels = {
  baja: 'Baja',
  media: 'Media',
  alta: 'Alta',
};
