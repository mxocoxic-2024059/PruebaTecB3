# Pull Request: Sprint 2 - CRUD Completo de Tareas

## Resumen

Este PR implementa el CRUD completo de tareas para el Servicio A (service-tasks) en el Sprint 2, completando la funcionalidad iniciada en el Sprint 1.

## Cambios Implementados

### Nuevos Endpoints

1. **GET /tasks/:id** - Obtener tarea específica por ID
   - Validación de ObjectId
   - Filtrado por usuario autenticado
   - 404 si no existe o no pertenece al usuario

2. **PUT /tasks/:id** - Actualizar tarea existente
   - Ignora campo `estado` (solo PATCH puede cambiar estado)
   - Validación de campos (titulo, prioridad)
   - Filtrado por usuario autenticado

3. **DELETE /tasks/:id** - Eliminar tarea
   - Validación de ObjectId
   - Filtrado por usuario autenticado
   - Verificación de eliminación

4. **PATCH /tasks/:id/status** - Actualizar estado con transiciones controladas
   - Transiciones permitidas: pendiente → en_progreso, en_progreso → completada, pendiente → completada
   - No permite cambios desde `completada`
   - Validación de transiciones

### Mejoras a Endpoints Existentes

5. **GET /tasks** - Filtrado mejorado
   - Query params opcionales: `titulo` (regex case-insensitive), `estado` (exacto), `prioridad` (exacto)
   - Combinación de filtros
   - Validación de valores de enum

### Infraestructura de Tests

6. **Suite de tests completa**
   - Tests para todos los endpoints nuevos
   - Tests de protección JWT en todas las rutas
   - Configuración de Jest
   - Variables de entorno para tests

### Documentación

7. **README actualizado**
   - Documentación completa de todos los endpoints
   - Ejemplos de request/response
   - Códigos de error y mensajes

## Decisiones de Implementación (Checklist)

✅ **Decisión #1**: PUT /tasks/:id NO permite cambiar el campo "estado"
- El campo `estado` se ignora si se envía en el body
- Solo se actualizan: titulo, descripcion, prioridad, fecha
- El cambio de estado se hace exclusivamente vía PATCH /tasks/:id/status

✅ **Decisión #2**: Transiciones de estado controladas en PATCH /tasks/:id/status
- Permitidas: pendiente → en_progreso, en_progreso → completada, pendiente → completada
- No permitidas: cualquier cambio desde "completada"
- Mensaje de error: "Transición de estado no permitida"

✅ **Decisión #3**: Filtrado siempre por usuarioId
- Todas las consultas, actualizaciones y eliminaciones filtran por usuarioId: req.user.id
- Si la tarea no existe O no pertenece al usuario: 404 con "Tarea no encontrada"
- Nunca se revela que la tarea existe pero es de otro usuario

✅ **Decisión #4**: Formato de error consistente
- Todos los errores usan formato: `{ mensaje: 'texto descriptivo' }`
- Sin campo "codigo" adicional
- Mantenido simple y consistente con el resto del servicio

## Formato de Respuesta para Servicio B

### Éxito
- Objetos/arregros JSON directos (sin wrapper)
- Incluyen todos los campos del modelo (_id, timestamps, etc.)

### Error
- `{ mensaje: 'texto descriptivo' }`
- Códigos HTTP estándar: 400, 401, 404, 500

## Ejemplos de Uso

### Crear tarea
```bash
POST /tasks
Authorization: Bearer <token>
{
  "titulo": "Nueva tarea",
  "prioridad": "alta"
}
```

### Obtener tarea por ID
```bash
GET /tasks/:id
Authorization: Bearer <token>
```

### Actualizar tarea (sin cambiar estado)
```bash
PUT /tasks/:id
Authorization: Bearer <token>
{
  "titulo": "Título actualizado",
  "prioridad": "media"
}
```

### Cambiar estado
```bash
PATCH /tasks/:id/status
Authorization: Bearer <token>
{
  "estado": "en_progreso"
}
```

### Eliminar tarea
```bash
DELETE /tasks/:id
Authorization: Bearer <token>
```

### Filtrar tareas
```bash
GET /tasks?titulo=informe&estado=pendiente&prioridad=alta
Authorization: Bearer <token>
```

## Tests

La suite de tests cubre:
- ✅ Todos los endpoints nuevos con casos de éxito y error
- ✅ Protección JWT en todas las rutas
- ✅ Validación de ObjectId
- ✅ Filtrado por usuario (tareas de otros usuarios retornan 404)
- ✅ Transiciones de estado válidas e inválidas
- ✅ Filtrado combinado en GET /tasks

Para ejecutar:
```bash
pnpm test
```

## Commits Realizados

1. `Feat(tasks): implementar GET /tasks/:id con validación de ObjectId y tests`
2. `Feat(tasks): implementar PUT /tasks/:id ignorando campo estado con tests`
3. `Feat(tasks): implementar DELETE /tasks/:id con verificación de eliminación y tests`
4. `Feat(tasks): implementar PATCH /tasks/:id/status con validación de transiciones y tests`
5. `Feat(tasks): implementar filtrado en GET /tasks con query params y tests`
6. `Test(tasks): agregar verificación de protección JWT en todas las rutas`
7. `Docs(tasks): actualizar README con documentación completa de endpoints CRUD`
8. `Test(tasks): agregar configuración de Jest`
9. `Test(tasks): configurar variables de entorno para tests`

## Notas para Servicio B

- El formato de respuesta es consistente: objeto/arreglo directo para éxito, `{ mensaje }` para errores
- Todos los endpoints de tareas requieren JWT válido
- El campo `usuarioId` se asigna automáticamente desde el token JWT
- Las transiciones de estado están controladas y validadas
- El filtrado en GET /tasks es opcional y combinable
- Puerto del servicio: 4002 (configurable via PORT)
- JWT_SECRET debe ser idéntico al usado por service-auth
