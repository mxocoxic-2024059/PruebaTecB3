# taskflow-frontend

Frontend React/Vite de TaskFlow, con integración endurecida en el Sprint 2.

## Configuración

```powershell
Copy-Item .env.example .env
pnpm dev:frontend
```

Rutas: `/login`, `/register`, `/dashboard`, `/tasks` y página 404.

## Capacidades reales de Tasks

- Disponibles e integradas: `GET /tasks` y `POST /tasks`.
- No disponibles en el contrato actual: `GET /tasks/:id`, `PUT /tasks/:id`,
  `PATCH /tasks/:id/status` y `DELETE /tasks/:id`.

Por esa razón la interfaz no muestra acciones funcionales para editar,
cambiar estado o eliminar. No se deben activar hasta que los responsables de
`service-tasks` publiquen y coordinen esos contratos.

## Identidad visual pendiente

El frontend reserva y documenta estos puntos reemplazables:

- `public/favicon.ico`: icono de la pestaña.
- `public/taskflow-icon.png`: símbolo compacto transparente dentro de la navegación.
- `src/assets/taskflow-logo.png`: logo completo dentro de las páginas.

Hasta que se añadan los recursos definitivos se muestra el nombre textual **TaskFlow** y un recuadro `Logo`; no se genera una identidad alternativa.

Para Login y Registro, `public/taskflow-icon.png` debe contener solamente el
símbolo de capas/check, sin el texto TaskFlow y con canal alfa. Un logotipo
horizontal completo no es intercambiable con este recurso.
