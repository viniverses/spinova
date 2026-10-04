import type { db } from "@spinova/database";

export type DatabaseTransaction = Parameters<typeof db.transaction>[0] extends
  (tx: infer Transaction) => unknown ? Transaction : never;
