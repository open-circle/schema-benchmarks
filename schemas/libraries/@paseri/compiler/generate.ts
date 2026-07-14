import * as fs from "node:fs";
import * as path from "node:path";

import "@paseri/paseri/introspect";
import { toSource } from "@paseri/compiler";
import dedent from "dedent";

import { getPaseriSchema } from "../paseri/index.ts";

// Ahead-of-time compile the shared paseri schema into a standalone parser module.
// Re-run with `pnpm run gen:paseri` whenever the schema changes.

// The compiler emits runtime-optimised TypeScript that is bundled (type-stripped), not type-checked
// as authored source. `@ts-nocheck` keeps the generated module out of the repo's strict typecheck;
// its runtime behaviour is covered by the library test suite.
const baseSource = dedent`
  // @ts-nocheck
  ${toSource(getPaseriSchema().toIR(), {
    name: "Product",
    trustedBareSpecifiers: ["@paseri/paseri"],
  })}
`;

fs.writeFileSync(path.join(import.meta.dirname, "compiled.gen.ts"), baseSource);

function toFactoryModule(source: string): string {
  const exportToken = "export { _schema as Product };";

  const exportIndex = source.lastIndexOf(exportToken);
  if (exportIndex < 0) {
    throw new Error("Expected generated source to end with `export { _schema as Product };`");
  }

  if (source.indexOf(exportToken, exportIndex + 1) !== -1) {
    throw new Error("Expected exactly one Product export alias");
  }

  const importLineRegex = /^import .*;\s*$/gm;
  let lastImportEnd = -1;
  for (const match of source.matchAll(importLineRegex)) {
    lastImportEnd = match.index + match[0].length;
  }

  if (lastImportEnd < 0) {
    throw new Error("Expected generated source to contain at least one top-level import");
  }

  const beforeBody = source.slice(0, lastImportEnd).trimEnd();
  const body = source.slice(lastImportEnd, exportIndex).trim();

  if (!body.includes("const _schema")) {
    throw new Error("Expected generated body to contain `const _schema`");
  }

  const indentedBody = body
    .split("\n")
    .map((line) => (line.length > 0 ? `  ${line}` : line))
    .join("\n");

  return `${beforeBody}\n\nexport function getPaseriSchema() {\n${indentedBody}\n\n  return _schema;\n}\n`;
}

const factorySource = toFactoryModule(baseSource);

fs.writeFileSync(path.join(import.meta.dirname, "index.gen.ts"), factorySource);
