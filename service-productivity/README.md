# service-productivity

Servicio HTTP de métricas de TaskFlow. Valida JWT HS256, consume `GET /tasks` mediante HTTP y calcula indicadores sin conectarse a MongoDB.

## Configuración

```powershell
Copy-Item .env.example .env
```

Variables: `PORT`, `TASKS_SERVICE_URL`, `JWT_SECRET`, `CORS_ORIGIN`.

## Endpoints

- `GET /health`: público.
- `GET /dashboard`: requiere `Authorization: Bearer <JWT>`.

## Comandos desde la raíz

```powershell
pnpm dev:productivity
pnpm --filter service-productivity test
pnpm --filter service-productivity lint
```
