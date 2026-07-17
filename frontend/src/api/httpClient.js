const DEFAULT_CONNECTION_MESSAGE = 'No fue posible conectar con el servicio.';

export class ApiError extends Error {
  constructor(message, status = 0, details = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

async function parseBody(response) {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function apiRequest(baseUrl, path, options = {}) {
  const { protectedRequest = false, headers = {}, body, ...requestOptions } = options;
  const requestHeaders = { Accept: 'application/json', ...headers };

  if (body !== undefined) requestHeaders['Content-Type'] = 'application/json';

  if (protectedRequest) {
    const token = sessionStorage.getItem('taskflow_token');
    if (token) requestHeaders.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      ...requestOptions,
      headers: requestHeaders,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(DEFAULT_CONNECTION_MESSAGE);
  }

  const data = await parseBody(response);

  if (!response.ok) {
    const message = data?.message || data?.mensaje || DEFAULT_CONNECTION_MESSAGE;
    const error = new ApiError(message, response.status, data?.details || null);

    if (protectedRequest && response.status === 401) {
      window.dispatchEvent(new CustomEvent('taskflow:unauthorized'));
    }

    throw error;
  }

  return data;
}
