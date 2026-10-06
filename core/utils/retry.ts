export interface RetryOptions {
  attempts?: number;
  /** Delay before the first retry; each subsequent attempt doubles it (capped at maxDelayMs). */
  baseDelayMs?: number;
  maxDelayMs?: number;
  /** Return false to stop retrying and rethrow immediately (e.g. non-transient failures). */
  shouldRetry?: (error: unknown) => boolean;
}

export async function retry<T>(action: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
  const {
    attempts = 3,
    baseDelayMs = 250,
    maxDelayMs = 5_000,
    shouldRetry = () => true,
  } = options;
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await action();
    } catch (error) {
      lastError = error;
      if (attempt >= attempts || !shouldRetry(error)) {
        throw error;
      }
      const exponentialDelay = Math.min(baseDelayMs * 2 ** (attempt - 1), maxDelayMs);
      // +/-20% jitter avoids retry storms when many workers fail at the same instant.
      const jitter = exponentialDelay * 0.2 * (Math.random() * 2 - 1);
      await new Promise((resolve) => setTimeout(resolve, exponentialDelay + jitter));
    }
  }

  throw lastError;
}

