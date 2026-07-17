import { apiRequest } from './httpClient';

const PRODUCTIVITY_API_URL = import.meta.env.VITE_PRODUCTIVITY_API_URL || 'http://localhost:4003';

export function getDashboard() {
  return apiRequest(PRODUCTIVITY_API_URL, '/dashboard', { protectedRequest: true });
}
