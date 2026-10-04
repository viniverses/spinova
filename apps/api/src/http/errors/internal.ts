import { HttpError } from "./http.ts";

export class InternalError extends HttpError {
  public readonly statusCode = 500;
  public readonly code: string;

  constructor(options?: {
    message?: string;
    code?: string;
    details?: unknown;
  }) {
    super(options?.message ?? "Internal server error", {
      details: options?.details,
    });
    this.code = options?.code ?? "INTERNAL_SERVER_ERROR";
  }
}
