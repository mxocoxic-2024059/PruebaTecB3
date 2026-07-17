# TaskFlow

TaskFlow es un monorepo para una aplicación web de gestión de tareas e indicadores de productividad. La baseline actual contiene dos servicios Node.js independientes y deja preparado el workspace para el frontend y el servicio de productividad.

## Estado actual

| Aplicación | Carpeta | Estado | Puerto |
| --- | --- | --- | ---: |
| Autenticación | `service-auth` | Registro, login y emisión de JWT | 4001 |
| Tareas | `service-tasks` | Crear y listar tareas del usuario autenticado | 4002 |
| Productividad | `service-productivity` | Dashboard real calculado desde Tasks | 4003 |
| Frontend | `frontend` | React/Vite, autenticación, dashboard y tareas | 5173 |

Auth es la fuente oficial del contrato JWT. Tasks valida el token y utiliza el claim `sub` como propietario de las tareas.

## Requisitos

- Node.js 22
- pnpm 9.1.0, administrado mediante Corepack
- MongoDB accesible para cada servicio

## Instalación

```powershell
corepack enable
corepack prepare pnpm@9.1.0 --activate
pnpm install
```

La instalación se ejecuta una sola vez desde la raíz y genera un único `pnpm-lock.yaml`.

## Variables de entorno

Cada servicio utiliza su propio archivo `.env` local. Estos archivos están ignorados y nunca deben añadirse a Git.

```powershell
Copy-Item service-auth/.env.example service-auth/.env
Copy-Item service-tasks/.env.example service-tasks/.env
```

Variables de Auth:

- `PORT`
- `NODE_ENV`
- `MONGO_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `CORS_ORIGIN`

Variables de Tasks:

- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `CORS_ORIGIN`

`JWT_SECRET` es obligatorio y debe configurarse localmente con el mismo valor seguro en Auth y Tasks. Ningún valor real debe escribirse en el repositorio.

## Comandos raíz

```powershell
pnpm dev                 # inicia en paralelo las aplicaciones existentes con script dev
pnpm dev:auth
pnpm dev:tasks
pnpm dev:productivity    # queda preparado; no falla si el paquete aún no existe
pnpm dev:frontend        # queda preparado; no falla si el paquete aún no existe
pnpm build
pnpm lint
pnpm test
```

Los comandos `build`, `lint` y `test` ejecutan únicamente los scripts existentes en cada paquete.

## Orden de arranque

1. Iniciar MongoDB.
2. Configurar los `.env` locales.
3. Ejecutar `pnpm dev:auth`.
4. Ejecutar `pnpm dev:tasks` en otra terminal, o usar `pnpm dev` para ambos.
5. Ejecutar `pnpm dev:productivity` y `pnpm dev:frontend`, o iniciar todo con `pnpm dev`.
6. Verificar los health checks y abrir `http://localhost:5173`.

## Contrato JWT compartido

```json
{
  "sub": "<id del usuario>",
  "correo": "<correo>",
  "nombre": "<nombre>"
}
```

El token se envía como `Authorization: Bearer <token>`. Auth firma con HS256 y Tasks restringe explícitamente la verificación a ese algoritmo.

## Workspace

```text
taskflow/
├── service-auth/
├── service-tasks/
├── service-productivity/
└── frontend/
```

## Recursos de marca

El repositorio deja preparados, pero no inventa, los recursos gráficos finales:

- `frontend/public/favicon.ico`: icono de la pestaña.
- `frontend/public/taskflow-icon.png`: icono compacto.
- `frontend/src/assets/taskflow-logo.png`: logo completo dentro de las páginas.

Mientras no estén disponibles, el frontend muestra el nombre **TaskFlow** y un espacio `Logo` claramente identificado.
