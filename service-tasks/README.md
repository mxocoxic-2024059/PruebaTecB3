# Servicio A - Gestión de Tareas

Microservicio para la gestión de tareas en un sistema basado en arquitectura de microservicios. Este servicio permite crear y consultar tareas, protegido mediante autenticación JWT.

## Características

- CRUD de tareas (Crear y Leer)
- Autenticación mediante JWT
- Filtrado de tareas por usuario
- Conexión a MongoDB con Mongoose
- Validación de datos de entrada

## Instalación

```bash
pnpm install
```

## Configuración de Variables de Entorno

Crea un archivo `.env` basándote en `.env.example`:

```env
PORT=4001
MONGODB_URI=mongodb://localhost:27017/tasks
JWT_SECRET=tu_secreto_compartido
```

**IMPORTANTE:** El valor de `JWT_SECRET` debe ser **idéntico** al utilizado por el Servicio de Autenticación. Ambos servicios deben usar la misma clave secreta para que la verificación de tokens funcione correctamente.

## Cómo Ejecutar

**Desarrollo:**
```bash
pnpm dev
```

**Producción:**
```bash
pnpm start
```

## Endpoints

### Público

#### GET /health
Verifica el estado del servicio.

**Respuesta:**
```json
{
  "status": "ok"
}
```

### Protegidos (requieren JWT)

Todos los endpoints protegidos requieren el header `Authorization` con formato `Bearer <token>`.

#### POST /tasks
Crea una nueva tarea asociada al usuario autenticado.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "titulo": "Título de la tarea",
  "descripcion": "Descripción opcional",
  "prioridad": "alta",
  "estado": "pendiente",
  "fecha": "2026-12-31"
}
```

**Campos:**
- `titulo` (String, requerido): Título de la tarea
- `descripcion` (String, opcional): Descripción detallada
- `prioridad` (String, opcional): "baja", "media", "alta" (default: "media")
- `estado` (String, opcional): "pendiente", "en_progreso", "completada" (default: "pendiente")
- `fecha` (Date, opcional): Fecha límite de la tarea

**Respuesta (201):**
```json
{
  "_id": "id_generado",
  "titulo": "Título de la tarea",
  "descripcion": "Descripción opcional",
  "prioridad": "alta",
  "estado": "pendiente",
  "fecha": "2026-12-31T00:00:00.000Z",
  "usuarioId": "id_usuario_autenticado",
  "createdAt": "2026-07-17T15:00:00.000Z",
  "updatedAt": "2026-07-17T15:00:00.000Z"
}
```

#### GET /tasks
Obtiene todas las tareas del usuario autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

**Respuesta (200):**
```json
[
  {
    "_id": "id_generado",
    "titulo": "Título de la tarea",
    "descripcion": "Descripción opcional",
    "prioridad": "alta",
    "estado": "pendiente",
    "fecha": "2026-12-31T00:00:00.000Z",
    "usuarioId": "id_usuario_autenticado",
    "createdAt": "2026-07-17T15:00:00.000Z",
    "updatedAt": "2026-07-17T15:00:00.000Z"
  }
]
```

## Estructura del Proyecto

```
service-tasks/
├── src/
│   ├── config/
│   │   └── db.js           # Conexión a MongoDB
│   ├── models/
│   │   └── Task.js         # Modelo de datos Tarea
│   ├── controllers/
│   │   └── task.controller.js  # Lógica de negocio
│   ├── routes/
│   │   └── task.routes.js  # Definición de rutas
│   ├── middlewares/
│   │   └── auth.middleware.js  # Middleware de autenticación JWT
│   └── app.js              # Punto de entrada de la aplicación
├── .env.example            # Plantilla de variables de entorno
├── package.json            # Dependencias y scripts
└── pnpm-lock.yaml          # Lockfile de pnpm
```

## Dependencias

- **express**: Framework web
- **mongoose**: ODM para MongoDB
- **dotenv**: Gestión de variables de entorno
- **cors**: Middleware CORS
- **jsonwebtoken**: Gestión de tokens JWT
- **nodemon** (dev): Recarga automática en desarrollo

## Notas

- El servicio corre por defecto en el puerto 4001, configurable vía variable de entorno `PORT`
- La conexión a MongoDB es obligatoria para el funcionamiento del servicio
- Los tokens JWT deben ser generados por el Servicio de Autenticación usando la misma `JWT_SECRET`
