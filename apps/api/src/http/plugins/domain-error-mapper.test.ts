import { Elysia } from "elysia";
import { describe, expect, it } from "vitest";

import { DomainError } from "../../shared/errors/domain.ts";
import { createDomainErrorMapper } from "./domain-error-mapper.ts";
import { errorHandlerPlugin } from "./error-handler.ts";

class ResourceMissingError extends DomainError {
  public readonly code = "RESOURCE_MISSING";

  constructor() {
    super("Resource missing.", { details: { resourceId: "resource-1" } });
  }
}

class InvalidResourceError extends DomainError {
  public readonly code = "INVALID_RESOURCE";

  constructor() {
    super("Resource is invalid.");
  }
}

const testErrorMapper = createDomainErrorMapper("test-error-mapper", [
  { errorType: ResourceMissingError, status: 404 },
]);

describe("createDomainErrorMapper", () => {
  it("maps a module-owned error after the global handler defers it", async () => {
    const routes = new Elysia().use(testErrorMapper).get("/test", () => {
      throw new ResourceMissingError();
    });
    const app = new Elysia().use(errorHandlerPlugin).use(routes);

    const response = await app.handle(new Request("http://localhost/test"));

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      error: {
        code: "RESOURCE_MISSING",
        message: "Resource missing.",
        details: { resourceId: "resource-1" },
      },
    });
  });

  it("uses 400 as the local fallback for a new domain error", async () => {
    const routes = new Elysia().use(testErrorMapper).get("/test", () => {
      throw new InvalidResourceError();
    });
    const app = new Elysia().use(errorHandlerPlugin).use(routes);

    const response = await app.handle(new Request("http://localhost/test"));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: {
        code: "INVALID_RESOURCE",
        message: "Resource is invalid.",
      },
    });
  });
});
