import { dirname, relative, resolve } from "node:path";
import ts from "typescript";

const info = (root: string, file: string) => {
  const parts = relative(root, file).replaceAll("\\", "/").split("/");
  return { path: parts.join("/"), area: parts[0], module: parts[0] === "modules" ? parts[1] : undefined, layer: parts[0] === "modules" ? parts[2] : undefined };
};

const dependencies = (source: ts.SourceFile) => {
  const result: { specifier: string; typeOnly: boolean }[] = [];
  const add = (node: ts.Node | undefined, typeOnly: boolean) => {
    if (node && ts.isStringLiteralLike(node)) result.push({ specifier: node.text, typeOnly });
  };
  const visit = (node: ts.Node): void => {
    if (ts.isImportDeclaration(node)) {
      const clause = node.importClause;
      const bindings = clause?.namedBindings;
      add(node.moduleSpecifier, Boolean(clause?.isTypeOnly || (!clause?.name && bindings && ts.isNamedImports(bindings) && bindings.elements.length > 0 && bindings.elements.every(e => e.isTypeOnly))));
    } else if (ts.isExportDeclaration(node)) {
      const clause = node.exportClause;
      add(node.moduleSpecifier, node.isTypeOnly || Boolean(clause && ts.isNamedExports(clause) && clause.elements.length > 0 && clause.elements.every(e => e.isTypeOnly)));
    } else if (ts.isImportEqualsDeclaration(node) && ts.isExternalModuleReference(node.moduleReference)) {
      add(node.moduleReference.expression, node.isTypeOnly);
    } else if (ts.isImportTypeNode(node) && ts.isLiteralTypeNode(node.argument)) {
      add(node.argument.literal, true);
    } else if (ts.isCallExpression(node) && (node.expression.kind === ts.SyntaxKind.ImportKeyword || (ts.isIdentifier(node.expression) && node.expression.text === "require"))) {
      const argument = node.arguments[0];
      if (argument && ts.isStringLiteralLike(argument)) add(argument, false);
      else result.push({ specifier: "<dynamic dependency>", typeOnly: false });
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return result;
};

/** Analyze source text directly, including reexports and dynamic/type imports. */
export const dependencyViolations = (root: string, file: string, text: string | ts.SourceFile): string[] => {
  const source = info(root, file);
  const ast = typeof text === "string" ? ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true) : text;
  const violations: string[] = [];
  for (const dependency of dependencies(ast)) {
    const base = dependency.specifier.startsWith("@/") ? resolve(root, dependency.specifier.slice(2)) : dependency.specifier.startsWith(".") ? resolve(dirname(file), dependency.specifier) : null;
    const target = base ? info(root, base) : null;
    const publicContract = Boolean(target?.module) && target?.module !== source.module && target?.layer === "index.ts" && dependency.typeOnly;
    let allowed = true;
    if (source.area === "shared") {
      allowed = target?.area === "shared";
    } else if (source.module && source.layer === "domain") {
      allowed = target?.area === "shared" || (target?.module === source.module && target?.layer === "domain");
    } else if (source.module && source.layer === "application") {
      allowed = target?.area === "shared" || (target?.module === source.module && ["domain", "application"].includes(target.layer ?? "")) || publicContract;
    } else if (source.module) {
      allowed = !target || ["shared", "http", "database"].includes(target.area ?? "") || target.module === source.module || publicContract;
      if (source.layer === "index.ts" && target?.module === source.module && target.layer === "infra" && !target.path.includes("/infra/http/")) allowed = false;
    } else if (source.area === "http" || source.area === "database") {
      allowed = !target || ["shared", "http", "database"].includes(target.area ?? "");
    } else if (target?.module && target.layer !== "index.ts") {
      allowed = source.path === "composition-root.ts";
    }
    if (dependency.specifier === "<dynamic dependency>") allowed = false;
    if (!allowed) violations.push(`${source.path} depends on forbidden ${dependency.specifier}`);
  }
  return violations;
};

const tableWriters: Record<string, readonly string[]> = {
  carts: ["cart"], cartItems: ["cart"], addresses: ["address"], wishlists: ["wishlist"],
  orders: ["order"], orderItems: ["order"], inventoryMovements: ["inventory"], products: ["catalog", "inventory"],
};

/** Cross-context SQL reads are allowed; mutations belong to the table owner. */
export const databaseOwnershipViolations = (root: string, file: string, text: string | ts.SourceFile): string[] => {
  const source = info(root, file);
  const ast = typeof text === "string" ? ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true) : text;
  const tables = new Map<string, string>();
  for (const node of ast.statements) {
    if (!ts.isImportDeclaration(node) || !ts.isStringLiteral(node.moduleSpecifier) || !node.moduleSpecifier.text.startsWith("@spinova/database")) continue;
    const bindings = node.importClause?.namedBindings;
    if (bindings && ts.isNamedImports(bindings)) {
      for (const element of bindings.elements) tables.set(element.name.text, element.propertyName?.text ?? element.name.text);
    } else if (bindings && ts.isNamespaceImport(bindings)) tables.set(bindings.name.text, "*");
  }
  const violations: string[] = [];
  const visit = (node: ts.Node): void => {
    if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression) && ["insert", "update", "delete"].includes(node.expression.name.text)) {
      const argument = node.arguments[0];
      const table = argument && ts.isIdentifier(argument) ? tables.get(argument.text) : argument && ts.isPropertyAccessExpression(argument) && ts.isIdentifier(argument.expression) && tables.get(argument.expression.text) === "*" ? argument.name.text : undefined;
      const owners = table ? tableWriters[table] : undefined;
      if (owners && !owners.includes(source.module ?? "")) violations.push(`${source.path} writes ${table}, owned by ${owners.join("/")}`);
      if (table === "products" && source.module !== "inventory" && ts.isPropertyAccessExpression(node.parent) && node.parent.name.text === "set" && ts.isCallExpression(node.parent.parent)) {
        const update = node.parent.parent.arguments[0];
        if (update && ts.isObjectLiteralExpression(update) && update.properties.some(property => property.name && (ts.isIdentifier(property.name) || ts.isStringLiteral(property.name)) && property.name.text === "stockQuantity")) {
          violations.push(`${source.path} changes stockQuantity, owned by inventory`);
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(ast);
  return violations;
};

export const architectureViolations = (root: string, file: string, text: string): string[] => {
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
  return [...dependencyViolations(root, file, source), ...databaseOwnershipViolations(root, file, source)];
};
