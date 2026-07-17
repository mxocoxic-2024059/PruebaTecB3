# service-auth

Servicio de Autenticación del **Sistema de gestión de tareas** (Sprint 1).
Responsable exclusivo del registro de usuarios, inicio de sesión, protección de
contraseñas con Argon2 y emisión de JWT que consumirán el Frontend, el Servicio
de Tareas (Servicio A) y el Servicio de Productividad (Servicio B).

## Requisitos previos

- Node.js 18+
- pnpm 9+ (`npm install -g pnpm` una sola vez, o `corepack enable`)
- MongoDB corriendo localmente o una URI remota (ej. MongoDB Atlas)

## Instalación

```bash
cd service-auth
pnpm install
```

## Configuración

1. Copiar el archivo de ejemplo y completar los valores:

```bash
cp .env.example .env
```

2. Variables disponibles:

| Variable       | Descripción                                         |
|----------------|------------------------------------------------------|
| `PORT`         | Puerto donde corre el servicio (por defecto 4001)    |
| `NODE_ENV`     | `development` \| `production` \| `test`              |
| `MONGO_URI`    | Cadena de conexión a MongoDB                          |
| `JWT_SECRET`   | Secreto para firmar los JWT                           |
| `JWT_EXPIRES_IN` | Tiempo de expiración del token (ej. `1h`, `15m`)   |
| `CORS_ORIGIN`  | Origen(es) permitidos, separados por coma             |

## Ejecución

```bash
# modo desarrollo (con recarga automática)
pnpm dev

# modo producción
pnpm start
```

El servicio queda disponible en `http://localhost:PORT`.

## Endpoints

### `GET /health`
Verifica que el servicio esté activo.

### `POST /auth/register`
Registra un nuevo usuario.

**Body:**
```json
{
  "nombre": "Ana Perez",
  "correo": "ana@example.com",
  "contrasena": "MiClaveSegura123"
}
```

**Respuesta 201:**
```json
{
  "success": true,
  "message": "Usuario registrado correctamente",
  "data": {
    "user": {
      "_id": "...",
      "nombre": "Ana Perez",
      "correo": "ana@example.com",
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
}
```

### `POST /auth/login`
Autentica a un usuario y retorna un JWT válido.

**Body:**
```json
{
  "correo": "ana@example.com",
  "contrasena": "MiClaveSegura123"
}
```

**Respuesta 200:**
```json
{
  "success": true,
  "message": "Inicio de sesion exitoso",
  "data": {
    "user": { "_id": "...", "nombre": "Ana Perez", "correo": "ana@example.com" },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## Contrato técnico del JWT (para Frontend, Servicio A y Servicio B)

- **Header a enviar:** `Authorization: Bearer <token>`
- **Algoritmo de firma:** HS256 (`jsonwebtoken`, secreto compartido `JWT_SECRET`)
- **Payload del token:**

```json
{
  "sub": "<id del usuario en MongoDB>",
  "correo": "usuario@example.com",
  "nombre": "Nombre del usuario",
  "iat": 1234567890,
  "exp": 1234571490
}
```

- Los servicios protegidos (Servicio A y Servicio B) deben **verificar el
  token con el mismo `JWT_SECRET`** configurado en este servicio antes de
  procesar cualquier solicitud a rutas protegidas.
- Si el token es inválido o expiró, el servicio consumidor debe responder
  `401 Unauthorized`.
- El campo `sub` identifica al usuario dueño de las tareas/indicadores y debe
  usarse para filtrar la información por usuario en los demás servicios.

## Manejo de errores

Todas las respuestas de error siguen el mismo formato:

```json
{
  "success": false,
  "message": "Descripción del error",
  "details": null
}
```

Códigos utilizados: `400` (validación), `401` (credenciales inválidas o token
inválido), `404` (ruta no encontrada), `409` (correo duplicado), `500` (error
interno).

## Estructura del proyecto

```
service-auth/
├── src/
│   ├── config/
│   │   ├── environment.js
│   │   └── database.js
│   ├── controllers/
│   │   └── auth.controller.js
│   ├── models/
│   │   └── user.model.js
│   ├── routes/
│   │   └── auth.routes.js
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── password.service.js
│   │   └── token.service.js
│   ├── validations/
│   │   └── auth.validation.js
│   ├── middlewares/
│   │   ├── error.middleware.js
│   │   └── not-found.middleware.js
│   ├── utils/
│   │   ├── api-response.js
│   │   └── app-error.js
│   ├── app.js
│   └── server.js
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Pruebas manuales sugeridas

Con el servidor corriendo, probar con `curl` o Postman:

```bash
curl -X POST http://localhost:4001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Ana Perez","correo":"ana@example.com","contrasena":"MiClaveSegura123"}'

curl -X POST http://localhost:4001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"correo":"ana@example.com","contrasena":"MiClaveSegura123"}'
```
