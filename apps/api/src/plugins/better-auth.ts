import { auth } from "@spinova/auth";
import { Elysia } from "elysia";
import { UnauthorizedError } from "../errors/index.ts";

export const betterAuthPlugin = new Elysia({ name: "better-auth" }).macro({
  auth: {
    async resolve({ request: { headers } }) {
      const session = await auth.api.getSession({ headers });

      if (!session) {
        throw new UnauthorizedError({
          message: "Sessão inválida ou expirada.",
        });
      }

      return {
        user: session.user,
        session: session.session,
      };
    },
  },
});
