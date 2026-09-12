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

/**
 * The probe prefixes its own declarations to stay clear of whatever a library exports, and names
 * the target type after the benchmark data. Neither reads well on the site.
 */
const toSnippet = (source: string) => source.replaceAll("probeSchema", "schema");

const describeFromType = (fromType: TypesResult["fromType"]) =>
  fromType
    ? `${fromType.style} (${Object.values(fromType.cases).filter(Boolean).length}/4 caught)`
    : "no";

const results: Array<TypesResult> = [];

for (const [libraryPath, getConfig] of Object.entries(libraries)) {
  const { library, types } = await getConfig();
  if (!types) continue;

  const directory = path.resolve(SCHEMAS_DIR, "libraries", path.dirname(libraryPath));
  console.log(`Probing types: ${library.name}`);
  const probed = probeTypes(directory, types);

  const inference = probed.inference && {
    schema: toInferredType(probed.inference.schema.text, probed.inference.schema.instantiations),
    input: {
      ...toInferredType(probed.inference.input.text, probed.inference.input.instantiations),
      snippet: toSnippet(types.input ?? ""),
      match: probed.inference.input.match,
    },
    output: {
      ...toInferredType(probed.inference.output.text, probed.inference.output.instantiations),
      snippet: toSnippet(types.output ?? ""),
      match: probed.inference.output.match,
    },
    instantiations: probed.inference.instantiations,
  };

  results.push({
    id: library.name,
    libraryName: library.name,
    version: library.version,
    note: types.note,
    inference,
    noInference: types.noInference,
    fromType: types.fromType &&
      probed.fromType && {
        style: types.fromType.style,
        snippet: toSnippet(types.fromType.schema),
        cases: probed.fromType.cases,
        derived: types.fromType.derived,
        note: types.fromType.note,
      },
  });
  const { inference: probedInference, fromType } = results.at(-1)!;
  console.log(
    probedInference
      ? `  ${probedInference.instantiations} instantiations, output ${probedInference.output.match}` +
          `, ${probedInference.schema.chars} chars, from type ${describeFromType(fromType)}`
      : `  no inference, from type ${describeFromType(fromType)}`,
  );
}

// libraries that infer nothing have no number to sort by, so they go last
results.sort(
  (a, b) =>
    (a.inference?.instantiations ?? Infinity) - (b.inference?.instantiations ?? Infinity) ||
    a.libraryName.localeCompare(b.libraryName),
);

const benchResults: TypesBenchResults = { typescriptVersion, results };

await fs.writeFile(path.resolve(process.cwd(), "./types.json"), JSON.stringify(benchResults));
