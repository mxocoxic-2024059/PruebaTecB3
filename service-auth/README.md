# service-auth

Servicio de autenticación de TaskFlow. Gestiona el registro, inicio de sesión, protección de contraseñas con Argon2id y emisión de JWT para los demás componentes.

## Requisitos y configuración

- Node.js 22
- pnpm 9.1.0 desde el workspace raíz
- MongoDB

Crear el archivo local de configuración:

```powershell
Copy-Item .env.example .env
```

Variables disponibles:

| Variable | Uso |
| --- | --- |
| `PORT` | Puerto del servicio; predeterminado 4001 |
| `NODE_ENV` | `development`, `production` o `test` |
| `MONGO_URI` | Conexión independiente de MongoDB |
| `JWT_SECRET` | Secreto compartido obligatorio |
| `JWT_EXPIRES_IN` | Expiración del token; predeterminado `1h` |
| `CORS_ORIGIN` | Uno o varios orígenes separados por coma |

El servicio falla al iniciar si `JWT_SECRET` no está configurado. El `.env` local no debe añadirse a Git.

## Ejecución

Desde la raíz:

```powershell
pnpm dev:auth
```

Desde esta carpeta también pueden ejecutarse `pnpm dev` o `pnpm start`.

## Endpoints

### `GET /health`

```json
{
  "success": true,
  "service": "service-auth",
  "status": "up"
}
```

### `POST /auth/register`

```json
{
  "nombre": "Ana Pérez",
  "correo": "ana@example.com",
  "contrasena": "MiClaveSegura123"
}
```

Responde 201 con `data.user`. El registro no emite token.

### `POST /auth/login`

```json
{
  "correo": "ana@example.com",
  "contrasena": "MiClaveSegura123"
}
```

Responde 200 con `data.user` y `data.token`.

## Contrato JWT

Auth es la fuente oficial del contrato:

```json
{
  "sub": "<ObjectId del usuario>",
  "correo": "<correo>",
  "nombre": "<nombre>",
  "iat": 1234567890,
  "exp": 1234571490
}
```

- Header: `Authorization: Bearer <token>`
- Firma: HS256
- Propietario: claim `sub`
- Expiración: `JWT_EXPIRES_IN`

## Estructura real

```text
service-auth/
├── configs/
│   ├── database.js
│   └── environment.js
├── middlewares/
│   ├── error.middleware.js
│   └── not-found.middleware.js
├── src/
│   ├── auth/
│   │   ├── auth.controller.js
│   │   ├── auth.routes.js
│   │   ├── auth.service.js
│   │   ├── auth.validation.js
│   │   ├── password.service.js
│   │   ├── token.service.js
│   │   └── user.model.js
│   ├── utils/
│   ├── app.js
│   └── index.js
├── .env.example
└── package.json
```
