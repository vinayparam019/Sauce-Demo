export class APIError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly responseBody?: string,
  ) {
    super(message);
    this.name = 'APIError';
  }
}

/** Network failures (status 0), rate limiting, and server errors are safe to retry. */
export function isTransientAPIError(error: unknown): boolean {
  return error instanceof APIError && (error.status === 0 || error.status === 429 || error.status >= 500);
}
