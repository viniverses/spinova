import { HttpError } from "./http.ts";

export class NotFoundError extends HttpError {
  public readonly statusCode = 404;
  public readonly code: string;

  constructor(options?: {
    message?: string;
    code?: string;
    details?: unknown;
  }) {
    super(options?.message ?? "Not found", { details: options?.details });
    this.code = options?.code ?? "RESOURCE_NOT_FOUND";
  }
}
