import { node } from "@elysia/node";
import { Elysia } from "elysia";

import { corsPlugin } from "@/plugins/cors.ts";
import { env } from "@package/env/server";
import { auth } from "@repo/auth";
import { hostname } from "os";

const app = new Elysia({ adapter: node() });

app.use(corsPlugin);
app.mount(auth.handler);

app.listen(
  {
    port: env.PORT,
    hostname: env.API_HOSTNAME,
  },
  ({ hostname: host, port }) => {
    console.log(
      `[💿 Spinova API] v${env.API_VERSION} is running at ${host}:${port}`,
    );
  },
);

export { app };
