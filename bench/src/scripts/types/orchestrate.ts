import * as fs from "node:fs/promises";
import * as path from "node:path";

import { libraries } from "@schema-benchmarks/schemas/libraries";

import type { InferredType, TypesBenchResults, TypesResult } from "#src/results/types.ts";
import { probeTypes, SCHEMAS_DIR, typescriptVersion } from "#src/scripts/types/probe.ts";

/**
 * A whole inferred type is worth reading, but a few libraries print tens of thousands of
 * characters, which no one scrolls through and every visitor would download. `chars` keeps the
 * real length either way.
 */
const MAX_TYPE_CHARS = 8_000;

function toInferredType(text: string, instantiations: number): InferredType {
  const truncated = text.length > MAX_TYPE_CHARS;
  return {
    text: truncated ? `${text.slice(0, MAX_TYPE_CHARS)}…` : text,
    chars: text.length,
    truncated: truncated || undefined,
    instantiations,
  };
}

/** The probe names the schema `probeSchema`; a reader of the site should see `schema`. */
const toSnippet = (expression: string) => expression.replaceAll("probeSchema", "schema");

const results: Array<TypesResult> = [];

for (const [libraryPath, getConfig] of Object.entries(libraries)) {
  const { library, types } = await getConfig();
  if (!types) continue;

  const directory = path.resolve(SCHEMAS_DIR, "libraries", path.dirname(libraryPath));
  console.log(`Probing types: ${library.name}`);
  const probed = probeTypes(directory, types);

  results.push({
    id: library.name,
    libraryName: library.name,
    version: library.version,
    note: types.note,
    schema: toInferredType(probed.schema.text, probed.schema.instantiations),
    input: {
      ...toInferredType(probed.input.text, probed.input.instantiations),
      snippet: toSnippet(types.input),
      match: probed.input.match,
    },
    output: {
      ...toInferredType(probed.output.text, probed.output.instantiations),
      snippet: toSnippet(types.output),
      match: probed.output.match,
    },
    instantiations: probed.instantiations,
  });
  const { instantiations, output } = results.at(-1)!;
  console.log(`  ${instantiations} instantiations, output ${output.match}, ${output.chars} chars`);
}

results.sort((a, b) => a.instantiations - b.instantiations);

const benchResults: TypesBenchResults = { typescriptVersion, results };

await fs.writeFile(path.resolve(process.cwd(), "./types.json"), JSON.stringify(benchResults));
