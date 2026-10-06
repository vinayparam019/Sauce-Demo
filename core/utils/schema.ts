export type Schema<T> = (value: unknown) => value is T;

export function assertSchema<T>(value: unknown, schema: Schema<T>, context: string): T {
  if (!schema(value)) {
    throw new Error(`Schema validation failed: ${context}`);
  }
  return value;
}

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;
