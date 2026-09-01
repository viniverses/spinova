import { AppError, RepositoryError } from "../errors/index.ts";
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

    if (error instanceof AppError) {
      if (error instanceof RepositoryError) {
        console.error("Repository operation failed", {
          operation: error.operation,
          tableName: error.tableName,
          error: error.originalError,
        });
      }

      set.status = error.statusCode;
      return {
        error: {
          code: error.code,
          message: error.message,
          ...(error.details === undefined ? {} : { details: error.details }),
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
