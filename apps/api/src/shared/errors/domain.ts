import { AppError } from "./app.ts";

export abstract class DomainError<TCode extends string = string> extends AppError {
  public abstract readonly code: TCode;
}
