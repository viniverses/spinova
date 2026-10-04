export type AppErrorOptions = {
  details?: unknown;
  cause?: unknown;
};

export abstract class AppError extends Error {
  public abstract readonly code: string;
  public readonly details?: unknown;

  constructor(message: string, options?: AppErrorOptions) {
    super(message, { cause: options?.cause });
    this.name = this.constructor.name;
    this.details = options?.details;
  }
}
