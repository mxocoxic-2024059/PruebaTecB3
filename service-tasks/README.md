# service-tasks

Servicio de gestión de tareas de TaskFlow. La implementación actual permite crear tareas y listar las tareas del usuario autenticado. No implementa todavía actualización ni eliminación.

## Requisitos y configuración

- Node.js 22
- pnpm 9.1.0 desde el workspace raíz
- MongoDB
- Un JWT emitido por `service-auth`

Crear el archivo local de configuración:

```powershell
Copy-Item .env.example .env
```

Variables:

| Variable | Uso |
| --- | --- |
| `PORT` | Puerto del servicio; predeterminado 4002 |
| `MONGODB_URI` | Conexión independiente de MongoDB |
| `JWT_SECRET` | Secreto compartido obligatorio |
| `CORS_ORIGIN` | Uno o varios orígenes permitidos, separados por coma |

El servicio falla al iniciar si `JWT_SECRET` no está configurado. El `.env` local no debe añadirse a Git.

## Ejecución

Desde la raíz:

```powershell
pnpm dev:tasks
```

Desde esta carpeta también pueden ejecutarse `pnpm dev` o `pnpm start`.

## Autenticación

Todas las rutas de tareas requieren:

```text
Authorization: Bearer <token>
```

El token debe estar firmado con HS256 y contener un `sub` que sea un ObjectId válido. Tasks normaliza el usuario autenticado como `req.user` y nunca acepta `usuarioId` desde el body.

## Endpoints actuales

### `GET /health`

Ruta pública:

```json
{
  "status": "ok"
}
```

### `POST /tasks`

Crea una tarea del usuario autenticado.

```json
{
  "titulo": "Preparar informe",
  "descripcion": "Descripción opcional",
  "prioridad": "alta",
  "estado": "pendiente",
  "fecha": "2026-12-31"
}
```

Campos:

- `titulo`: requerido.
- `descripcion`: opcional.
- `prioridad`: `baja`, `media` o `alta`; predeterminado `media`.
- `estado`: `pendiente`, `en_progreso` o `completada`; predeterminado `pendiente`.
- `fecha`: fecha opcional.
- `usuarioId`: asignado exclusivamente desde el claim JWT `sub`.

Responde 201 con la tarea creada.

### `GET /tasks`

Lista únicamente las tareas cuyo `usuarioId` coincide con el claim `sub` del usuario autenticado. Responde 200 con un array.

## Errores de autenticación

Token ausente:

```json
{
  "mensaje": "Token no proporcionado"
}
```

Token inválido, expirado o sin `sub` válido:

```json
{
  "mensaje": "Token inválido o expirado"
}
```
