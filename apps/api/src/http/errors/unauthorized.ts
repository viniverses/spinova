import { HttpError } from "./http.ts";

export class UnauthorizedError extends HttpError {
  public readonly statusCode = 401;
  public readonly code: string;

  constructor(options?: {
    message?: string;
    code?: string;
    details?: unknown;
  }) {
    super(options?.message ?? "Unauthorized", { details: options?.details });
    this.code = options?.code ?? "UNAUTHORIZED";
  }
}
