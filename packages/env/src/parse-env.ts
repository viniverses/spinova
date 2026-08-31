import type { z } from "zod";

export function parseEnv<TSchema extends z.ZodType>(
  schema: TSchema,
  values: unknown,
): z.output<TSchema> {
  const result = schema.safeParse(values);

  if (result.success) {
    return result.data;
  }

  const issues = result.error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("\n");

  throw new Error(`Invalid environment variables:\n${issues}`);
}
