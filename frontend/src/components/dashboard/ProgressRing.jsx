export default function ProgressRing({ percentage, completed, total }) {
  return (
    <section className="panel progress-panel">
      <div>
        <p className="eyebrow">Tu avance</p>
        <h2>Progreso de finalización</h2>
        <p>Completa tus tareas prioritarias y mantén el ritmo de trabajo.</p>
        <strong>{completed} de {total} tareas completadas</strong>
      </div>
      <div className="progress-ring" style={{ '--progress': `${percentage * 3.6}deg` }} role="img" aria-label={`${percentage}% completado`}>
        <div><strong>{percentage}%</strong><span>Completado</span></div>
      </div>
    </section>
  );
}
