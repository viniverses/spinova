import { AppError, type ErrorCode } from "./app.ts";

export class RepositoryError extends AppError {
  public readonly operation: string;
  public readonly tableName: string;
  public readonly originalError?: unknown;

  constructor(operation: string, tableName: string, originalError?: unknown) {
    super({
      code: "REPOSITORY_ERROR" as ErrorCode,
      statusCode: 500,
      message: "The request could not be completed.",
    });
    this.name = "RepositoryError";
    this.operation = operation;
    this.tableName = tableName;
    this.originalError = originalError;
  }
}
