import { readdirSync, readFileSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { architectureViolations, databaseOwnershipViolations, dependencyViolations } from "./dependency-rules.ts";

const sourceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const collectSourceFiles = (directory: string): string[] =>
  readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = join(directory, entry.name);
    return entry.isDirectory() ? collectSourceFiles(file) :
      extname(file) === ".ts" && !file.endsWith(".test.ts") ? [file] : [];
  });

describe("module architecture", () => {
  it("protects dependencies and database ownership in production", () => {
    expect(collectSourceFiles(sourceRoot).flatMap(file => {
      const text = readFileSync(file, "utf8");
      return architectureViolations(sourceRoot, file, text);
    })).toEqual([]);
  }, 15000);

  it.each([
    ["modules/cart/domain/example.ts", 'import { Elysia } from "elysia";'],
    ["modules/cart/domain/example.ts", 'import type { SQL } from "drizzle-orm";'],
    ["modules/cart/domain/example.ts", 'import { db } from "@spinova/database";'],
    ["modules/cart/domain/example.ts", 'import { plugin } from "../../../http/example.ts";'],
    ["modules/cart/domain/example.ts", 'export type { Address } from "../../address/index.ts";'],
    ["modules/cart/application/example.ts", 'import { db } from "@spinova/database";'],
    ["modules/cart/application/example.ts", 'import { plugin } from "../../../http/example.ts";'],
    ["modules/cart/application/example.ts", 'export * from "../../../database/errors/index.ts";'],
    ["modules/cart/application/example.ts", 'export * from "../infra/http/cart.routes.ts";'],
    ["modules/cart/application/example.ts", 'import type { Address } from "../../address/domain/address.types.ts";'],
    ["modules/cart/application/example.ts", 'import { createProductRoutes } from "../../catalog/index.ts";'],
    ["shared/contracts/example.ts", 'export * from "../../modules/cart/index.ts";'],
    ["shared/contracts/example.ts", 'import type { AnyElysia } from "elysia";'],
    ["shared/contracts/example.ts", 'export { db } from "../../database/example.ts";'],
    ["shared/contracts/example.ts", 'import type { Plugin } from "../../http/example.ts";'],
    ["database/example.ts", 'import type { Address } from "../modules/address/index.ts";'],
    ["http/example.ts", 'export * from "../modules/cart/index.ts";'],
    ["app.ts", 'export * from "./modules/cart/infra/repositories/example.ts";'],
    ["modules/cart/index.ts", 'export * from "./infra/repositories/example.ts";'],
    ["modules/cart/infra/example.ts", 'import { writer } from "../../order/infra/example.ts";'],
    ["modules/cart/domain/example.ts", 'const library = await import("elysia");'],
    ["modules/cart/domain/example.ts", 'type Database = import("@spinova/database").Database;'],
    ["modules/cart/application/example.ts", 'import library = require("elysia");'],
    ["modules/cart/application/example.ts", 'const library = require("elysia");'],
    ["modules/cart/application/example.ts", 'const library = await import(name);'],
    ["modules/cart/domain/example.ts", 'export * from "@/http/example.ts";'],
  ])("rejects forbidden dependency in %s: %s", (file, text) => {
    expect(dependencyViolations(sourceRoot, resolve(sourceRoot, file), text)).not.toEqual([]);
  });

  it.each([
    ["modules/cart/domain/example.ts", 'import { Money } from "../../../shared/value-objects/money.ts";'],
    ["modules/cart/domain/example.ts", 'export * from "./entities/cart.entity.ts";'],
    ["modules/cart/application/example.ts", 'import type { Cart } from "../domain/entities/cart.entity.ts";'],
    ["modules/cart/application/example.ts", 'import type { ProductSummary } from "../../catalog/index.ts";'],
    ["modules/cart/application/example.ts", 'export type { ProductSummary } from "../../catalog/index.ts";'],
    ["modules/cart/application/example.ts", 'import { type ProductSummary } from "../../catalog/index.ts";'],
    ["modules/cart/application/example.ts", 'export { type ProductSummary } from "../../catalog/index.ts";'],
    ["modules/cart/index.ts", 'export * from "./infra/http/cart.routes.ts";'],
    ["modules/cart/infra/example.ts", 'import { db } from "@spinova/database";'],
    ["shared/contracts/example.ts", 'export * from "../value-objects/money.ts";'],
    ["http/example.ts", 'import { InfraError } from "../database/errors/infra.ts";'],
    ["composition-root.ts", 'import { DrizzleOrderWriter } from "./modules/order/infra/transaction/drizzle-order.writer.ts";'],
  ])("accepts intentional dependency in %s", (file, text) => {
    expect(dependencyViolations(sourceRoot, resolve(sourceRoot, file), text)).toEqual([]);
  });

  it.each([
    ["checkout", 'import { orders } from "@spinova/database"; tx.insert(orders);'],
    ["checkout", 'import { products } from "@spinova/database"; tx.update(products);'],
    ["checkout", 'import { cartItems } from "@spinova/database"; tx.delete(cartItems);'],
    ["cart", 'import { orderItems as items } from "@spinova/database"; tx.insert(items);'],
    ["catalog", 'import { products } from "@spinova/database"; tx.update(products).set({ stockQuantity: 1 });'],
    ["checkout", 'import * as schema from "@spinova/database"; tx.insert(schema.inventoryMovements);'],
  ])("rejects writes outside ownership in %s", (module, text) => {
    expect(databaseOwnershipViolations(sourceRoot, resolve(sourceRoot, `modules/${module}/infra/example.ts`), text)).not.toEqual([]);
  });

  it.each([
    ["order", 'import { orders, orderItems } from "@spinova/database"; tx.insert(orders); tx.insert(orderItems);'],
    ["inventory", 'import { products, inventoryMovements } from "@spinova/database"; tx.update(products).set({ stockQuantity: 1 }); tx.insert(inventoryMovements);'],
    ["cart", 'import { cartItems } from "@spinova/database"; tx.delete(cartItems);'],
    ["cart", 'import { products } from "@spinova/database"; tx.select().from(products);'],
    ["catalog", 'import { products } from "@spinova/database"; tx.update(products).set({ price: "10.00" });'],
  ])("accepts owned writes and cross-context reads in %s", (module, text) => {
    expect(databaseOwnershipViolations(sourceRoot, resolve(sourceRoot, `modules/${module}/infra/example.ts`), text)).toEqual([]);
  });
});
