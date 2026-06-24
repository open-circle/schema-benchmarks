import * as fs from "node:fs";
import * as path from "node:path";

import "@paseri/paseri/introspect";
import { toSource } from "@paseri/compiler";

import { getPaseriSchema } from "../paseri/index.ts";

// Ahead-of-time compile the shared paseri schema into a standalone parser module.
// Re-run with `node generate.ts` (from this directory) whenever the schema changes.
const source = toSource(getPaseriSchema().toIR(), {
  name: "Product",
  trustedBareSpecifiers: ["@paseri/paseri"],
});

// The compiler emits runtime-optimised TypeScript that is bundled (type-stripped), not type-checked
// as authored source. `@ts-nocheck` keeps the generated module out of the repo's strict typecheck;
// its runtime behaviour is covered by the library test suite.
fs.writeFileSync(path.join(import.meta.dirname, "compiled.gen.ts"), `// @ts-nocheck\n${source}`);
