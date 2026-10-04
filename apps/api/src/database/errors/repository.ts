import { InfraError } from "./infra.ts";

export class RepositoryError extends InfraError {
  public readonly code = "REPOSITORY_ERROR";
  public readonly operation: string;
  public readonly tableName: string;

  constructor(operation: string, tableName: string, originalError?: unknown) {
    super("The request could not be completed.", {
      originalError,
    });
    this.operation = operation;
    this.tableName = tableName;
  }
}
