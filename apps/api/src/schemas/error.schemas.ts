import { t as Type } from "elysia";

const ErrorPayloadSchema = Type.Object({
  code: Type.String(),
  message: Type.String(),
  details: Type.Optional(Type.Unknown()),
});

export const createErrorResponseSchema = (description: string) =>
  Type.Object({ error: ErrorPayloadSchema }, { description });

export const ValidationErrorResponseSchema = createErrorResponseSchema(
  "One or more request parameters failed validation.",
);

export const InternalServerErrorResponseSchema = createErrorResponseSchema(
  "An unexpected error occurred while processing the request.",
);
