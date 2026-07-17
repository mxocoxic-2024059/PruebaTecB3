import { AlertCircle, Inbox, Plus, RefreshCw } from 'lucide-react';

export function LoadingState({ cards = 4 }) {
  return <div className="skeleton-grid" aria-label="Cargando información">{Array.from({ length: cards }, (_, index) => <div className="skeleton-card" key={index} />)}</div>;
}

export function ErrorState({ message, onRetry }) {
  return (
    <section className="page-state" role="alert">
      <AlertCircle size={38} /><h2>No pudimos cargar la información</h2><p>{message}</p>
      <button className="button button--secondary" type="button" onClick={onRetry}><RefreshCw size={18} /> Intentar nuevamente</button>
    </section>
  );
}

export function EmptyTasksState({ onCreate }) {
  return (
    <section className="page-state">
      <Inbox size={44} /><h2>Aún no tienes tareas.</h2><p>Crea tu primera tarea para comenzar a organizar tu trabajo.</p>
      <button className="button button--primary" type="button" onClick={onCreate}><Plus size={18} /> Crear primera tarea</button>
    </section>
  );
}
