import { useEffect, useState } from 'react';
import { CalendarDays, Check, X } from 'lucide-react';
import { createTask } from '../../api/tasksApi';
import { ApiError } from '../../api/httpClient';

const initialForm = {
  titulo: '',
  descripcion: '',
  prioridad: 'media',
  estado: 'pendiente',
  fecha: '',
};

export default function CreateTaskModal({ open, onClose, onCreated }) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const handleEscape = (event) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.titulo.trim()) {
      setError('Ingresa un título para la tarea.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const payload = {
        titulo: form.titulo.trim(),
        descripcion: form.descripcion.trim(),
        prioridad: form.prioridad,
        estado: form.estado,
      };
      if (form.fecha) payload.fecha = form.fecha;

      const task = await createTask(payload);
      setForm(initialForm);
      await onCreated(task);
      onClose();
    } catch (requestError) {
      setError(requestError instanceof ApiError ? requestError.message : 'No fue posible crear la tarea.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="new-task-title">
        <div className="modal__header">
          <div><p className="eyebrow">Mis tareas</p><h2 id="new-task-title">Nueva tarea</h2></div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Cerrar formulario"><X size={22} /></button>
        </div>
        {error && <div className="notice notice--error" role="alert" aria-live="assertive">{error}</div>}
        <form className="task-form" onSubmit={handleSubmit}>
          <div className="form-field form-field--full">
            <label htmlFor="task-title">Título</label>
            <input id="task-title" name="titulo" autoFocus maxLength="160" placeholder="Ej. Preparar informe semanal" value={form.titulo} onChange={updateField} />
          </div>
          <div className="form-field form-field--full">
            <label htmlFor="task-description">Descripción <span>(opcional)</span></label>
            <textarea id="task-description" name="descripcion" rows="4" placeholder="Añade los detalles necesarios…" value={form.descripcion} onChange={updateField} />
          </div>
          <div className="form-field">
            <label htmlFor="task-priority">Prioridad</label>
            <select id="task-priority" name="prioridad" value={form.prioridad} onChange={updateField}>
              <option value="baja">Baja</option><option value="media">Media</option><option value="alta">Alta</option>
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="task-status">Estado</label>
            <select id="task-status" name="estado" value={form.estado} onChange={updateField}>
              <option value="pendiente">Pendiente</option><option value="en_progreso">En progreso</option><option value="completada">Completada</option>
            </select>
          </div>
          <div className="form-field form-field--full">
            <label htmlFor="task-date"><CalendarDays size={16} /> Fecha límite <span>(opcional)</span></label>
            <input id="task-date" name="fecha" type="date" value={form.fecha} onChange={updateField} />
          </div>
          <div className="modal__actions form-field--full">
            <button className="button button--secondary" type="button" onClick={onClose}>Cancelar</button>
            <button className="button button--primary" type="submit" disabled={loading}><Check size={19} /> {loading ? 'Creando…' : 'Crear tarea'}</button>
          </div>
        </form>
      </section>
    </div>
  );
}
