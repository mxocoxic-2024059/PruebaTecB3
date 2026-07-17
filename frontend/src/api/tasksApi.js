import { apiRequest } from './httpClient.js';

const TASKS_API_URL = import.meta.env?.VITE_TASKS_API_URL || 'http://localhost:4002';

export function getTasks() {
  return apiRequest(TASKS_API_URL, '/tasks', { protectedRequest: true });
}

export function createTask(task) {
  return apiRequest(TASKS_API_URL, '/tasks', {
    method: 'POST',
    protectedRequest: true,
    body: task,
  });
}
