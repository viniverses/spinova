import { AppError } from "../../shared/errors/app.ts";

export abstract class HttpError extends AppError {
  public abstract readonly statusCode: number;
}
