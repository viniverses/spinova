import { AppError, DomainError } from "../../shared/errors/index.ts";
import { HttpError } from "../errors/http.ts";
import { InfraError } from "../../database/errors/infra.ts";
import { RepositoryError } from "../../database/errors/repository.ts";
import { Elysia } from "elysia";

export const errorHandlerPlugin = new Elysia({
  name: "error-handler-plugin",
})
  .onError(({ code, error, set }) => {
    if (code === "VALIDATION") {
      set.status = 422;
      return {
        error: {
          code: "VALIDATION_ERROR",
          message: "The submitted parameters are invalid.",
          details: error.all,
        },
      };
    }

    if (error instanceof DomainError) return;

    if (error instanceof AppError) {
      let statusCode = 400;

      if (error instanceof HttpError) {
        statusCode = error.statusCode;
      } else if (error instanceof InfraError) {
        if (error instanceof RepositoryError) {
          console.error("Repository operation failed", {
            operation: error.operation,
            tableName: error.tableName,
            error: error.originalError,
          });
        } else {
          console.error(`[${error.name}] Infrastructure operation failed:`, {
            code: error.code,
            message: error.message,
            originalError: error.originalError,
          });
        }
        statusCode = 500;
      }

      set.status = statusCode;
      return {
        error: {
          code: error.code,
          message: error.message,
          ...(error instanceof InfraError
            ? {}
            : error.details === undefined
              ? {}
              : { details: error.details }),
        },
      };
    }

    console.error("Unhandled API error", error);
    set.status = 500;
    return {
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "The request could not be completed.",
      },
    };
  })
  .as("global");
