import { CalendarDays, Circle, CircleCheck, Clock3 } from 'lucide-react';
import { formatDate, isOverdue, priorityLabels, statusLabels } from '../../utils/tasks';

const statusIcons = {
  pendiente: Circle,
  en_progreso: Clock3,
  completada: CircleCheck,
};

export default function TaskCard({ task, compact = false }) {
  const overdue = isOverdue(task);
  const Icon = statusIcons[task.estado] || Circle;

  return (
    <article className={`task-card ${compact ? 'task-card--compact' : ''}`}>
      <div className={`task-card__status-icon status-${task.estado}`} aria-hidden="true"><Icon size={18} /></div>
      <div className="task-card__body">
        <div className="task-card__title-row">
          <h3>{task.titulo}</h3>
          <span className={`badge priority-${task.prioridad}`}>{priorityLabels[task.prioridad] || task.prioridad}</span>
        </div>
        {task.descripcion && <p>{task.descripcion}</p>}
        <div className="task-card__meta">
          <span className={`badge status-${overdue ? 'overdue' : task.estado}`}><Icon size={14} /> {overdue ? 'Vencida' : statusLabels[task.estado] || task.estado}</span>
          <span className={overdue ? 'text-danger' : ''}><CalendarDays size={15} /> {formatDate(task.fecha)}</span>
        </div>
      </div>
    </article>
  );
}
