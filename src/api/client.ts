export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retries?: number;
}

export class APIError extends Error {
  status?: number;
  code?: string;
  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.code = code;
  }
}

/**
 * Single centralized API Client with robust offline checking, timeout, and retry capabilities
 */
export async function apiClient<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const {
    method = 'GET',
    headers = {},
    body,
    timeout = 15000,
    retries = 2
  } = options;

  // Offline check
  if (!navigator.onLine) {
    throw new APIError('You appear to be offline. Please check your internet connection and try again.', 0, 'OFFLINE');
  }

  const token = localStorage.getItem('researchmind_token');
  const fetchHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...headers
  };

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const fetchOptions: RequestInit = {
    method,
    headers: fetchHeaders,
    signal: controller.signal
  };

  if (body) {
    fetchOptions.body = JSON.stringify(body);
  }

  let attempt = 0;
  while (attempt <= retries) {
    try {
      const response = await fetch(url, fetchOptions);
      clearTimeout(id);

      if (!response.ok) {
        let errorMessage = 'An unexpected error occurred.';
        try {
          const errData = await response.json();
          errorMessage = errData.error || errorMessage;
        } catch {
          // If response is not JSON
          errorMessage = response.statusText || errorMessage;
        }

        // Catch typical rate limit / api key errors and format nicely
        if (response.status === 429) {
          throw new APIError('Rate limit exceeded. Please wait a moment before trying again.', 429, 'RATE_LIMIT');
        }
        if (response.status === 401 || errorMessage.includes('GEMINI_API_KEY')) {
          throw new APIError('Invalid or missing GEMINI_API_KEY. Please verify your API Key in your workspace Secrets.', response.status, 'INVALID_API_KEY');
        }

        throw new APIError(errorMessage, response.status);
      }

      return (await response.json()) as T;
    } catch (err: any) {
      if (err.name === 'AbortError') {
        if (attempt === retries) {
          throw new APIError('Request timed out. The server is taking longer than expected to respond.', 408, 'TIMEOUT');
        }
      } else if (err instanceof APIError) {
        throw err;
      } else {
        if (attempt === retries) {
          throw new APIError(err.message || 'Network connectivity error.', 500, 'NETWORK_ERROR');
        }
      }

      attempt++;
      // Wait slightly before retry
      await new Promise(resolve => setTimeout(resolve, 500 * attempt));
    }
  }

  throw new APIError('API execution failed after retries.', 500);
}
