import {
  AppError,
  type AppErrorOptions,
} from "../../shared/errors/app.ts";

export type InfraErrorOptions = AppErrorOptions & {
  originalError?: unknown;
};

export abstract class InfraError extends AppError {
  public readonly originalError?: unknown;

  constructor(message: string, options?: InfraErrorOptions) {
    super(message, {
      details: options?.details,
      cause: options?.originalError ?? options?.cause,
    });
    this.originalError = options?.originalError;
  }
}
