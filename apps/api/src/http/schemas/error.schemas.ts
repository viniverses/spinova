import { t as Type } from "elysia";

export const ErrorPayloadSchema = Type.Object({
  code: Type.String(),
  message: Type.String(),
  details: Type.Optional(Type.Unknown()),
});

export const createErrorResponseSchema = (description: string) =>
  Type.Object({ error: ErrorPayloadSchema }, { description });

export const BadRequestResponseSchema = createErrorResponseSchema(
  "The request parameters or body are invalid.",
);

export const UnauthorizedResponseSchema = createErrorResponseSchema(
  "Authentication required.",
);

export const NotFoundResponseSchema = createErrorResponseSchema(
  "The requested resource was not found.",
);

export const ConflictResponseSchema = createErrorResponseSchema(
  "The request could not be completed due to a conflict.",
);

export const ValidationErrorResponseSchema = createErrorResponseSchema(
  "One or more request parameters failed validation.",
);

export const InternalServerErrorResponseSchema = createErrorResponseSchema(
  "An unexpected error occurred while processing the request.",
);
