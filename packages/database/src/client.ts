import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "@spinova/env/server";
import { Pool } from "pg";

import * as schema from "./schema/index.ts";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });
