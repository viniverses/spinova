import { Elysia } from "elysia";

import { DomainError } from "../../shared/errors/domain.ts";

export type DomainErrorHttpStatus = 400 | 404 | 409;

type DomainErrorType = abstract new (...args: never[]) => DomainError;

export interface DomainErrorMapping {
  errorType: DomainErrorType;
  status: DomainErrorHttpStatus;
}

export const createDomainErrorMapper = (
  name: string,
  mappings: readonly DomainErrorMapping[],
) =>
  new Elysia({ name })
    .onError(({ error, set }) => {
      if (!(error instanceof DomainError)) return;

      const mapping = mappings.find(
        ({ errorType }) => error instanceof errorType,
      );
      set.status = mapping?.status ?? 400;

      return {
        error: {
          code: error.code,
          message: error.message,
          ...(error.details === undefined ? {} : { details: error.details }),
        },
      };
    })
    .as("scoped");
