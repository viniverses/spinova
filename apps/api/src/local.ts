import { node } from "@elysia/node";
import { env } from "@spinova/env/server";
import { Elysia } from "elysia";

import api from "./index.ts";

const app = new Elysia({ adapter: node() }).use(api);

app.listen(
  {
    port: env.PORT,
    hostname: env.API_HOSTNAME,
  },
  ({ hostname, port }) => {
    console.log(
      `[💿 Spinova API] v${env.API_VERSION} is running at ${hostname}:${port}`,
    );
  },
);
