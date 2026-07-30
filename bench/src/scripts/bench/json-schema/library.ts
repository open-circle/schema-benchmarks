import { parseArgs } from "node:util";

import { jsonSchemaDirectionSchema, jsonSchemaTargetSchema } from "@schema-benchmarks/schemas";
import { libraries } from "@schema-benchmarks/schemas/libraries";
import { ensureArray, partition } from "@schema-benchmarks/utils";
import { getSigintSignal } from "@schema-benchmarks/utils/node";
import { Bench, type Task, type TaskResultCompleted } from "tinybench";

import { CaseRegistry } from "../../../bench/registry.ts";
import type { JsonSchemaSupportResult } from "../../../results/types.ts";
import { getEmptyJsonSchemaResults } from "../../../results/types.ts";

const {
  values: { lib },
} = parseArgs({
  options: {
    lib: {
      type: "string",
      short: "l",
    },
  },
});

if (!lib || !libraries[lib]) {
  throw new Error(`Library not found: ${lib}`);
}

const libraryConfig = await libraries[lib]();

const sigintSignal = getSigintSignal();

const results = getEmptyJsonSchemaResults();

const { library, jsonSchema: jsonSchemaConfig } = libraryConfig;
const { name: libraryName, version } = library;

if (!jsonSchemaConfig) {
  console.log(JSON.stringify(results));
  process.exit(0);
}

console.log(`\nBenchmarking JSON schema: ${libraryName}`);

const bench = new Bench({ signal: sigintSignal });
const caseRegistry = new CaseRegistry();

bench.addEventListener("start", () => {
  console.log("Starting bench...");
});
bench.addEventListener("cycle", (event) => {
  console.log("Starting cycle", caseRegistry.get(event.task?.name ?? ""));
});
bench.addEventListener("complete", () => {
  console.log("Bench complete");
});

for (const benchConfig of ensureArray(jsonSchemaConfig)) {
  const {
    generate,
    snippet,
    source,
    standardJsonSchema: standardJsonSchemaConfig,
    note,
  } = benchConfig;
  const unsupported: JsonSchemaSupportResult["unsupported"] = [];
  for (const target of jsonSchemaTargetSchema.options) {
    for (const direction of jsonSchemaDirectionSchema.options) {
      const options = { target, direction };
      let jsonSchema;
      try {
        // libraries throw for anything they can't convert, which is recorded instead
        jsonSchema = generate(options);
      } catch (error) {
        const reason = error instanceof Error ? error.message : String(error);
        console.log(`Skipping ${direction} JSON schema for ${target}:`, reason);
        unsupported.push({ target, direction, reason });
        continue;
      }
      const entry = {
        type: "jsonSchema",
        target,
        direction,
        source,
        standardJsonSchema: standardJsonSchemaConfig?.support,
        jsonSchema: JSON.stringify(jsonSchema, null, 2),
        libraryName,
        version,
        snippet: snippet(options),
        note,
      } as const;
      if (source === "runtime") {
        bench.add(caseRegistry.add(entry), () => generate(options));
        continue;
      }
      // the schema is a constant, so there's nothing to time
      results.bench.push({
        ...entry,
        id: crypto.randomUUID(),
        mean: 0,
      });
    }
  }
  results.support.push({
    id: crypto.randomUUID(),
    libraryName,
    version,
    note,
    source,
    standardJsonSchema: standardJsonSchemaConfig?.support,
    unsupported,
  });
}

const tasks = await bench.run();

const [successTasks, errorTasks] = partition(
  tasks,
  (task): task is Task & { result: TaskResultCompleted } => task.result.state === "completed",
);
if (errorTasks.length) {
  console.error(
    "Errors:",
    errorTasks.map((task) => (task.result.state === "errored" ? task.result.error : task.result)),
  );
}

for (const task of successTasks) {
  const entry = caseRegistry.get(task.name);
  if (!entry || entry.type !== "jsonSchema") continue;
  results.bench.push({
    type: "jsonSchema",
    id: task.name,
    libraryName: entry.libraryName,
    version: entry.version,
    snippet: entry.snippet,
    note: entry.note,
    mean: task.result.latency.mean,
    target: entry.target,
    direction: entry.direction,
    source: entry.source,
    standardJsonSchema: entry.standardJsonSchema,
    jsonSchema: entry.jsonSchema,
  });
}

console.log(`  Completed: ${tasks.length} benchmarks`);

console.log(JSON.stringify(results));
