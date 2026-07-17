export function buildTaskPayload(form) {
  const payload = {
    titulo: form.titulo.trim(),
    descripcion: form.descripcion.trim(),
    prioridad: form.prioridad,
    estado: form.estado,
  };

  if (form.fecha) payload.fecha = form.fecha;
  return payload;
}
