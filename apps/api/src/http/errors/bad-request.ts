import { HttpError } from "./http.ts";

export class BadRequestError extends HttpError {
  public readonly statusCode = 400;
  public readonly code: string;

  constructor(options?: {
    message?: string;
    code?: string;
    details?: unknown;
  }) {
    super(options?.message ?? "Invalid request", { details: options?.details });
    this.code = options?.code ?? "BAD_REQUEST";
  }
}
