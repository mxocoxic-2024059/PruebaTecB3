# TaskFlow: guía para agentes

- Usa exclusivamente **pnpm 9.1.0** desde la raíz y **Node 22**.
- Puertos: Auth `4001`, Tasks `4002`, Productivity `4003`, Frontend `5173`.
- JWT oficial: `{ sub, correo, nombre }`, firmado con HS256. `sub` es el propietario.
- Campos Auth: `nombre`, `correo`, `contrasena`. Campos Task: `titulo`, `descripcion`, `prioridad`, `estado`, `fecha`, `usuarioId`.
- No modifiques Auth o Tasks sin coordinación con sus responsables.
- El tema oscuro debe usar grises carbón, nunca azul marino saturado.
- Sprint 1: autenticación, sesión, tareas crear/listar, dashboard real, temas y responsive. No Kanban, edición, borrado ni funciones avanzadas.
- Validación: `pnpm install`, `pnpm build`, `pnpm lint`, `pnpm test` y pruebas de integración cuando MongoDB esté disponible.
