import { describe, expect, it, vi } from "vitest";
import { Elysia } from "elysia";

import { BadRequestError } from "../errors/index.ts";
import { RepositoryError } from "../../database/errors/repository.ts";
import { errorHandlerPlugin } from "./error-handler.ts";

describe("errorHandlerPlugin", () => {
  it("handles HttpError (BadRequestError -> 400)", async () => {
    const app = new Elysia().use(errorHandlerPlugin).get("/test", () => {
      throw new BadRequestError({ message: "Invalid payload" });
    });

    const res = await app.handle(new Request("http://localhost/test"));
    const body = (await res.json()) as {
      error: { code: string; message: string; details?: unknown };
    };

    expect(res.status).toBe(400);
    expect(body.error.code).toBe("BAD_REQUEST");
    expect(body.error.message).toBe("Invalid payload");
  });

  it("handles InfraError (RepositoryError -> 500)", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const app = new Elysia().use(errorHandlerPlugin).get("/test", () => {
      throw new RepositoryError(
        "find",
        "orders",
        new Error("DB connection failed"),
      );
    });

    const res = await app.handle(new Request("http://localhost/test"));
    const body = (await res.json()) as {
      error: { code: string; message: string };
    };

    expect(res.status).toBe(500);
    expect(body.error.code).toBe("REPOSITORY_ERROR");
    expect(body.error.message).toBe("The request could not be completed.");
    expect(body.error).not.toHaveProperty("details");
    expect(JSON.stringify(body)).not.toContain("DB connection failed");
    expect(consoleSpy).toHaveBeenCalledWith(
      "Repository operation failed",
      expect.any(Object),
    );

    consoleSpy.mockRestore();
  });

  it("handles unexpected non-AppError (500)", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const app = new Elysia().use(errorHandlerPlugin).get("/test", () => {
      throw new Error("Unexpected crash");
    });

    const res = await app.handle(new Request("http://localhost/test"));
    const body = (await res.json()) as {
      error: { code: string; message: string };
    };

    expect(res.status).toBe(500);
    expect(body.error.code).toBe("INTERNAL_SERVER_ERROR");
    expect(consoleSpy).toHaveBeenCalledWith(
      "Unhandled API error",
      expect.any(Error),
    );

    consoleSpy.mockRestore();
  });
});
