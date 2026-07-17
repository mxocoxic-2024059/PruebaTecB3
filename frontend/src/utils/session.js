export const SESSION_TOKEN_KEY = 'taskflow_token';
export const SESSION_USER_KEY = 'taskflow_user';
export const SESSION_EXPIRED_MESSAGE = 'Tu sesión expiró. Inicia sesión nuevamente.';

function resolveStorage(storage) {
  if (storage) return storage;
  return typeof sessionStorage === 'undefined' ? null : sessionStorage;
}

export function clearStoredSession(storage) {
  const target = resolveStorage(storage);
  target?.removeItem(SESSION_TOKEN_KEY);
  target?.removeItem(SESSION_USER_KEY);
}

export function readStoredSession(storage) {
  const target = resolveStorage(storage);
  if (!target) return { token: null, user: null };

  const token = target.getItem(SESSION_TOKEN_KEY);
  const storedUser = target.getItem(SESSION_USER_KEY);

  if (!token || !storedUser) {
    clearStoredSession(target);
    return { token: null, user: null };
  }

  try {
    const user = JSON.parse(storedUser);
    if (!user || typeof user !== 'object') throw new Error('Invalid user');
    return { token, user };
  } catch {
    clearStoredSession(target);
    return { token: null, user: null };
  }
}

export function persistSession(response, storage) {
  const token = response?.data?.token;
  const user = response?.data?.user;

  if (!token || !user || typeof user !== 'object') {
    throw new Error('Respuesta de autenticación inválida');
  }

  const target = resolveStorage(storage);
  if (!target) throw new Error('El almacenamiento de sesión no está disponible');

  target.setItem(SESSION_TOKEN_KEY, token);
  target.setItem(SESSION_USER_KEY, JSON.stringify(user));
  return { token, user };
}

export function getStoredToken(storage) {
  return resolveStorage(storage)?.getItem(SESSION_TOKEN_KEY) || null;
}
