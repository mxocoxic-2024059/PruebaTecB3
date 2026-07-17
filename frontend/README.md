# taskflow-frontend

Frontend React/Vite del Sprint 1 de TaskFlow.

## Configuración

```powershell
Copy-Item .env.example .env
pnpm dev:frontend
```

Rutas: `/login`, `/register`, `/dashboard`, `/tasks` y página 404.

## Identidad visual pendiente

El frontend reserva y documenta estos puntos reemplazables:

- `public/favicon.ico`: icono de la pestaña.
- `public/taskflow-icon.png`: icono compacto dentro de la navegación.
- `src/assets/taskflow-logo.png`: logo completo dentro de las páginas.

Hasta que se añadan los recursos definitivos se muestra el nombre textual **TaskFlow** y un recuadro `Logo`; no se genera una identidad alternativa.
