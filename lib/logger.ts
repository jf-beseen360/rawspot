export interface Logger {
  info(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  error(message: string, context?: Record<string, unknown>): void;
}

const format = (
  level: string,
  message: string,
  context?: Record<string, unknown>,
): string =>
  context !== undefined
    ? `[${level}] ${message} ${JSON.stringify(context)}`
    : `[${level}] ${message}`;

export const logger: Logger = {
  info: (m, c) => console.info(format("info", m, c)),
  warn: (m, c) => console.warn(format("warn", m, c)),
  error: (m, c) => console.error(format("error", m, c)),
};
