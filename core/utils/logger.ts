export interface Logger {
  info(message: string, metadata?: Record<string, unknown>): void;
  error(message: string, metadata?: Record<string, unknown>): void;
}

export const logger: Logger = {
  info(message, metadata) {
    console.info(JSON.stringify({ level: 'info', message, ...metadata }));
  },
  error(message, metadata) {
    console.error(JSON.stringify({ level: 'error', message, ...metadata }));
  },
};
