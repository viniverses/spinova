import { node } from "@elysia/node";
import { Elysia } from "elysia";

import { corsPlugin } from "@/plugins/cors.ts";
import { auth } from "@repo/auth";

const app = new Elysia({ adapter: node() });

app.use(corsPlugin);
app.mount(auth.handler);

app.listen(process.env.PORT, ({ hostname, port }) => {
  console.log(
    `[💿 Spinova API] v${process.env.API_VERSION} is running at ${hostname}:${port}`,
  );
});

export { app };
