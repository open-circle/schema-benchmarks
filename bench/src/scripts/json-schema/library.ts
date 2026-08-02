import { parseArgs } from "node:util";

import {
  fromJsonBenchSchema,
  jsonSchemaDirectionSchema,
  jsonSchemaTargetSchema,
} from "@schema-benchmarks/schemas";
import { libraries } from "@schema-benchmarks/schemas/libraries";
import { ensureArray, partition } from "@schema-benchmarks/utils";
import { getSigintSignal } from "@schema-benchmarks/utils/node";
import { Bench, type Task, type TaskResultCompleted } from "tinybench";

import type { JsonSchemaBenchmarkConfigEntry } from "../../bench/registry.ts";
import { Registry } from "../../bench/registry.ts";
import type { JsonSchemaSupportMatrix } from "../../results/types.ts";
import { getEmptyJsonSchemaResults } from "../../results/types.ts";

function getOrInsertRecord<K extends string, V>(
  record: Partial<Record<K, V>>,
  key: K,
  defaultValue: NonNullable<NoInfer<V>>,
): NonNullable<V> {
  return (record[key] ??= defaultValue);
}

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

const matrix: JsonSchemaSupportMatrix = {};
results.conversion.toJsonSupport[libraryName] = { version, matrix };

console.log(`\nBenchmarking JSON schema: ${libraryName}`);

const bench = new Bench({ signal: sigintSignal });
const caseRegistry = new Registry<JsonSchemaBenchmarkConfigEntry>();

bench.addEventListener("start", () => {
  console.log("Starting bench...");
});
bench.addEventListener("cycle", (event) => {
  console.log("Starting cycle", caseRegistry.get(event.task?.name ?? ""));
});
bench.addEventListener("complete", () => {
  console.log("Bench complete");
});

if (jsonSchemaConfig.conversion?.toJson) {
  for (const benchConfig of ensureArray(jsonSchemaConfig.conversion.toJson)) {
    const { generate, snippet, standardJsonSchema: standardJsonSchemaConfig, note } = benchConfig;
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

          getOrInsertRecord(matrix, target, {})[direction] = reason;
          continue;
        }
        const entry: JsonSchemaBenchmarkConfigEntry = {
          type: "conversion",
          conversionType: "toJson",
          target,
          direction,
          standardJsonSchema:
            standardJsonSchemaConfig?.support === "package"
              ? {
                  support: standardJsonSchemaConfig.support,
                  package: standardJsonSchemaConfig.package,
                }
              : standardJsonSchemaConfig?.support,
          jsonSchema: JSON.stringify(jsonSchema, null, 2),
          libraryName,
          version,
          snippet: snippet(options),
          note,
        };
        bench.add(caseRegistry.add(entry), () => generate(options));
      }
    }
  }
}

if (jsonSchemaConfig.conversion?.fromJson) {
  for (const benchConfig of ensureArray(jsonSchemaConfig.conversion.fromJson)) {
    const { generate, snippet, note } = benchConfig;
    const entry: JsonSchemaBenchmarkConfigEntry = {
      type: "conversion",
      conversionType: "fromJson",
      libraryName,
      version,
      snippet,
      note,
    };
    bench.add(caseRegistry.add(entry), () => generate(structuredClone(fromJsonBenchSchema)));
  }
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
  if (!entry || entry.type !== "conversion") continue;
  switch (entry.conversionType) {
    case "toJson":
      results.conversion[entry.conversionType].push({
        id: task.name,
        libraryName: entry.libraryName,
        version: entry.version,
        snippet: entry.snippet,
        note: entry.note,
        mean: task.result.latency.mean,
        target: entry.target,
        direction: entry.direction,
        standardJsonSchema: entry.standardJsonSchema,
        jsonSchema: entry.jsonSchema,
      });
      break;
    case "fromJson":
      results.conversion[entry.conversionType].push({
        id: task.name,
        libraryName: entry.libraryName,
        version: entry.version,
        snippet: entry.snippet,
        note: entry.note,
        mean: task.result.latency.mean,
      });
  }
}

console.log(`  Completed: ${tasks.length} benchmarks`);

console.log(JSON.stringify(results));
