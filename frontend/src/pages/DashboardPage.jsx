import { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, CircleDot, Clock3, ListTodo, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getDashboard } from '../api/productivityApi';
import { getTasks } from '../api/tasksApi';
import { ApiError } from '../api/httpClient';
import { useAuth } from '../context/AuthContext';
import MetricCard from '../components/dashboard/MetricCard';
import ProgressRing from '../components/dashboard/ProgressRing';
import TaskCard from '../components/tasks/TaskCard';
import CreateTaskModal from '../components/tasks/CreateTaskModal';
import { EmptyTasksState, ErrorState, LoadingState } from '../components/ui/PageState';
import { sortUpcomingTasks } from '../utils/tasks';

export default function DashboardPage() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [dashboardResponse, tasksResponse] = await Promise.all([getDashboard(), getTasks()]);
      setMetrics(dashboardResponse.data);
      setTasks(tasksResponse);
    } catch (requestError) {
      setError(requestError instanceof ApiError ? requestError.message : 'No fue posible conectar con el servicio.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  async function handleCreated() {
    setAnnouncement('Tarea creada correctamente.');
    await loadDashboard();
  }

  const upcomingTasks = sortUpcomingTasks(tasks).slice(0, 4);

  return (
    <div className="page dashboard-page">
      <div className="page-heading">
        <div><p className="eyebrow">Resumen general</p><h1>¡Hola, {user?.nombre?.split(' ')[0] || 'usuario'}! <span aria-hidden="true">👋</span></h1><p>Aquí tienes un resumen real de tu productividad.</p></div>
        <button className="button button--primary" type="button" onClick={() => setModalOpen(true)}><Plus size={19} /> Nueva tarea</button>
      </div>
      <div className="sr-only" aria-live="polite">{announcement}</div>

      {loading && <LoadingState cards={6} />}
      {!loading && error && <ErrorState message={error} onRetry={loadDashboard} />}
      {!loading && !error && metrics?.total === 0 && <EmptyTasksState onCreate={() => setModalOpen(true)} />}
      {!loading && !error && metrics?.total > 0 && (
        <>
          <section className="metrics-grid" aria-label="Indicadores de productividad">
            <MetricCard label="Total" value={metrics.total} icon={ListTodo} tone="purple" description="Todas tus tareas" />
            <MetricCard label="Completadas" value={metrics.completadas} icon={CheckCircle2} tone="green" description="Trabajo finalizado" />
            <MetricCard label="En progreso" value={metrics.enProgreso} icon={Clock3} tone="blue" description="En desarrollo" />
            <MetricCard label="Pendientes" value={metrics.pendientes} icon={CircleDot} tone="orange" description="Por comenzar" />
            <MetricCard label="Vencidas" value={metrics.vencidas} icon={AlertTriangle} tone="red" description="Requieren atención" />
            <MetricCard label="Finalización" value={`${metrics.porcentajeFinalizacion}%`} icon={CheckCircle2} tone="purple" description="Progreso total" />
          </section>
          <div className="dashboard-grid">
            <ProgressRing percentage={metrics.porcentajeFinalizacion} completed={metrics.completadas} total={metrics.total} />
            <section className="panel recent-panel">
              <div className="panel__heading"><div><p className="eyebrow">En foco</p><h2>Próximas tareas</h2></div><Link to="/tasks">Ver todas</Link></div>
              <div className="compact-task-list">
                {upcomingTasks.length ? upcomingTasks.map((task) => <TaskCard task={task} compact key={task._id} />) : <p className="muted-copy">No hay tareas pendientes.</p>}
              </div>
            </section>
          </div>
        </>
      )}
      <CreateTaskModal open={modalOpen} onClose={() => setModalOpen(false)} onCreated={handleCreated} />
    </div>
  );
}
