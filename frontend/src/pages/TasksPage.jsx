import { useCallback, useEffect, useMemo, useState } from 'react';
import { ListFilter, Plus } from 'lucide-react';
import { getTasks } from '../api/tasksApi';
import { ApiError } from '../api/httpClient';
import TaskCard from '../components/tasks/TaskCard';
import CreateTaskModal from '../components/tasks/CreateTaskModal';
import { EmptyTasksState, ErrorState, LoadingState } from '../components/ui/PageState';
import { filterTasks } from '../utils/tasks';

const filters = [
  ['todas', 'Todas'],
  ['pendiente', 'Pendientes'],
  ['en_progreso', 'En progreso'],
  ['completada', 'Completadas'],
  ['vencidas', 'Vencidas'],
];

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [activeFilter, setActiveFilter] = useState('todas');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setTasks(await getTasks());
    } catch (requestError) {
      setError(requestError instanceof ApiError ? requestError.message : 'No fue posible conectar con el servicio.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadTasks(); }, [loadTasks]);
  const visibleTasks = useMemo(() => filterTasks(tasks, activeFilter), [tasks, activeFilter]);

  async function handleCreated() {
    setAnnouncement('Tarea creada correctamente.');
    await loadTasks();
  }

  return (
    <div className="page tasks-page">
      <div className="page-heading">
        <div><p className="eyebrow">Organización diaria</p><h1>Mis tareas</h1><p>Consulta y crea tareas sin perder de vista sus prioridades.</p></div>
        <button className="button button--primary" type="button" onClick={() => setModalOpen(true)}><Plus size={19} /> Nueva tarea</button>
      </div>
      <div className="sr-only" aria-live="polite">{announcement}</div>

      {!loading && !error && tasks.length > 0 && (
        <div className="filter-bar" aria-label="Filtrar tareas">
          <span><ListFilter size={18} /> Filtrar</span>
          <div className="filter-tabs">
            {filters.map(([value, label]) => <button type="button" className={activeFilter === value ? 'is-active' : ''} onClick={() => setActiveFilter(value)} key={value}>{label}</button>)}
          </div>
        </div>
      )}

      {loading && <LoadingState cards={5} />}
      {!loading && error && <ErrorState message={error} onRetry={loadTasks} />}
      {!loading && !error && tasks.length === 0 && <EmptyTasksState onCreate={() => setModalOpen(true)} />}
      {!loading && !error && tasks.length > 0 && visibleTasks.length === 0 && <section className="page-state page-state--small"><h2>No hay tareas en este filtro.</h2><p>Prueba con otra categoría.</p></section>}
      {!loading && !error && visibleTasks.length > 0 && <section className="task-list" aria-label="Lista de tareas">{visibleTasks.map((task) => <TaskCard task={task} key={task._id} />)}</section>}

      <CreateTaskModal open={modalOpen} onClose={() => setModalOpen(false)} onCreated={handleCreated} />
    </div>
  );
}
