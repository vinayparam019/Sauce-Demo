import { APIRequestContext, APIResponse } from '@playwright/test';
import { APIError, isTransientAPIError } from './errors';
import { logger } from '../utils/logger';
import { retry } from '../utils/retry';

export interface APIClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
  authToken?: string;
  /** Number of retries for transient failures (network errors, 429, 5xx). Default: 0. */
  retries?: number;
}

export interface APIRequestOptions {
  headers?: Record<string, string>;
  data?: unknown;
  timeout?: number;
}

export class APIClient {
  private readonly config: Required<Pick<APIClientConfig, 'baseURL' | 'timeout' | 'retries'>> &
    APIClientConfig;

  constructor(
    private readonly request: APIRequestContext,
    config: APIClientConfig,
  ) {
    this.config = { timeout: 30_000, retries: 0, ...config };
  }

  async get<T>(endpoint: string, options?: APIRequestOptions): Promise<T> {
    return this.send<T>('GET', endpoint, options);
  }

  async post<T>(endpoint: string, data?: unknown, options?: APIRequestOptions): Promise<T> {
    return this.send<T>('POST', endpoint, { ...options, data });
  }

  async put<T>(endpoint: string, data?: unknown, options?: APIRequestOptions): Promise<T> {
    return this.send<T>('PUT', endpoint, { ...options, data });
  }

  async patch<T>(endpoint: string, data?: unknown, options?: APIRequestOptions): Promise<T> {
    return this.send<T>('PATCH', endpoint, { ...options, data });
  }

  async delete<T = void>(endpoint: string, options?: APIRequestOptions): Promise<T> {
    return this.send<T>('DELETE', endpoint, options);
  }

  private async send<T>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    endpoint: string,
    options: APIRequestOptions = {},
  ): Promise<T> {
    return retry(() => this.executeRequest<T>(method, endpoint, options), {
      attempts: this.config.retries + 1,
      baseDelayMs: 250,
      shouldRetry: isTransientAPIError,
    });
  }

  private async executeRequest<T>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    endpoint: string,
    options: APIRequestOptions,
  ): Promise<T> {
    const url = this.buildURL(endpoint);
    try {
      const response = await this.request.fetch(url, {
        method,
        headers: this.buildHeaders(options.headers),
        data: options.data,
        timeout: options.timeout ?? this.config.timeout,
      });
      logger.info('API request completed', { method, url, status: response.status() });
      return this.parseResponse<T>(response, method, endpoint);
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      const message = error instanceof Error ? error.message : String(error);
      logger.error('API request failed', { method, url, message });
      throw new APIError(0, `${method} ${endpoint} could not be completed: ${message}`);
    }
  }


  private buildURL(endpoint: string): string {
    return endpoint.startsWith('http')
      ? endpoint
      : `${this.config.baseURL.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
  }

  private buildHeaders(overrides?: Record<string, string>): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      ...this.config.headers,
      ...(this.config.authToken ? { Authorization: `Bearer ${this.config.authToken}` } : {}),
      ...overrides,
    };
  }

  private async parseResponse<T>(
    response: APIResponse,
    method: string,
    endpoint: string,
  ): Promise<T> {
    if (!response.ok()) {
      const body = await response.text();
      throw new APIError(response.status(), `${method} ${endpoint} failed`, body);
    }

    if (response.status() === 204) {
      return undefined as T;
    }

    const contentType = response.headers()['content-type'] ?? '';
    return contentType.includes('application/json')
      ? ((await response.json()) as T)
      : ((await response.text()) as T);
  }
}
