import { apiRequest, ApiError } from './httpClient.js';

const AUTH_API_URL = import.meta.env?.VITE_AUTH_API_URL || 'http://localhost:4001';

export async function login(credentials) {
  try {
    return await apiRequest(AUTH_API_URL, '/auth/login', { method: 'POST', body: credentials });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      throw new ApiError('Correo electrónico o contraseña incorrectos.', 401);
    }
    throw error;
  }
}

export function register(user) {
  return apiRequest(AUTH_API_URL, '/auth/register', { method: 'POST', body: user });
}
