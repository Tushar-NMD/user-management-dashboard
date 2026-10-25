import { ApiError, ApiResponse } from '../types/api';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers as Record<string, string>),
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Parse JSON safely
    let data: ApiResponse<T> | null = null;
    try {
      data = await response.json();
    } catch {
      // response might be empty or non-JSON
    }

    if (!response.ok) {
      const message =
        data?.message || `Request failed with status ${response.status}: ${response.statusText}`;
      throw new ApiError(message, response.status, data?.errors);
    }

    if (!data) {
      throw new ApiError('Empty response received from server', response.status);
    }

    return (data.data !== undefined ? data.data : (data as unknown as T)) as T;
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ApiError(
        'Unable to connect to the backend server. Please verify the API is running at ' + BASE_URL,
        0
      );
    }

    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    throw new ApiError(message);
  }
}
