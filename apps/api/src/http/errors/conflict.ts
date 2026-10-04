import { HttpError } from "./http.ts";

export class ConflictError extends HttpError {
  public readonly statusCode = 409;
  public readonly code: string;

  constructor(options?: {
    message?: string;
    code?: string;
    details?: unknown;
  }) {
    super(options?.message ?? "Resource already exists", {
      details: options?.details,
    });
    this.code = options?.code ?? "RESOURCE_CONFLICT";
  }
}
