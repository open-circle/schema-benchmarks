import { parseArgs } from "node:util";

import { errorData, invalidStrings, successData, validStrings } from "@schema-benchmarks/schemas";
import { libraries } from "@schema-benchmarks/schemas/libraries";
import { ensureArray, partition, unsafeEntries } from "@schema-benchmarks/utils";
import { Bench, type Task, type TaskResultCompleted } from "tinybench";

import { CaseRegistry } from "../../bench/registry.ts";
import { getEmptyResults } from "../../results/types.ts";

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

const sigintAc = new AbortController();
process.on("SIGINT", (signal) => {
  sigintAc.abort(signal);
});

const results = getEmptyResults();

const caseRegistry = new CaseRegistry();

const { library, initialization, validation, parsing, standard, string, codec } = libraryConfig;
const { name: libraryName, optimizeType: libraryOptimizeType, version } = library;

console.log(`\nBenchmarking: ${libraryName}`);

// Create a fresh Bench for this library
const bench = new Bench({ signal: sigintAc.signal });
bench.addEventListener("start", () => {
  console.log("Starting bench...");
});
bench.addEventListener("cycle", (event) => {
  console.log("Starting cycle", caseRegistry.get(event.task?.name ?? ""));
});
bench.addEventListener("complete", () => {
  console.log("Bench complete");
});

for (const benchConfig of ensureArray(initialization)) {
  const { run, snippet, note, optimizeType = libraryOptimizeType, throws } = benchConfig;
  bench.add(
    caseRegistry.add({
      type: "initialization",
      optimizeType,
      libraryName,
      version,
      snippet,
      note,
      throws,
    }),
    () => run(),
  );
}
if (validation) {
  for (const [dataType, data] of [
    ["valid", successData],
    ["invalid", errorData],
  ] as const) {
    for (const benchConfig of ensureArray(validation)) {
      const { run, snippet, note, optimizeType = libraryOptimizeType, throws } = benchConfig;
      bench.add(
        caseRegistry.add({
          type: "validation",
          optimizeType,
          dataType,
          libraryName,
          version,
          snippet,
          note,
          throws,
        }),
        () => run(data),
      );
    }
  }
}
if (parsing) {
  for (const [dataType, data] of [
    ["valid", successData],
    ["invalid", errorData],
  ] as const) {
    for (const [errorType, benchConfigs] of unsafeEntries(parsing)) {
      if (!benchConfigs) continue;
      for (const benchConfig of ensureArray(benchConfigs)) {
        const { run, snippet, note, optimizeType = libraryOptimizeType, throws } = benchConfig;
        bench.add(
          caseRegistry.add({
            type: "parsing",
            optimizeType,
            dataType,
            errorType,
            libraryName,
            version,
            snippet,
            note,
            throws,
          }),
          () => run(data),
        );
      }
    }
  }
  if (standard) {
    for (const [dataType, data] of [
      ["valid", successData],
      ["invalid", errorData],
    ] as const) {
      for (const [errorType, benchConfigs] of unsafeEntries(standard)) {
        if (!benchConfigs) continue;
        for (const benchConfig of ensureArray(benchConfigs)) {
          const {
            schema,
            snippet = "upfetch(url, { schema })",
            note,
            optimizeType = libraryOptimizeType,
          } = benchConfig;
          bench.add(
            caseRegistry.add({
              type: "standard",
              optimizeType,
              errorType,
              dataType,
              libraryName,
              version,
              snippet,
              note,
            }),
            () => schema["~standard"].validate(data),
          );
        }
      }
    }
  }
  if (string) {
    for (const [dataType, data] of [
      ["valid", validStrings],
      ["invalid", invalidStrings],
    ] as const) {
      for (const [stringFormat, benchConfigs] of unsafeEntries(string)) {
        if (!benchConfigs) continue;
        for (const benchConfig of ensureArray(benchConfigs)) {
          const { create, snippet, note, optimizeType = libraryOptimizeType, throws } = benchConfig;
          const run = await create();
          bench.add(
            caseRegistry.add({
              type: "string",
              optimizeType,
              dataType,
              stringFormat,
              libraryName,
              version,
              snippet,
              note,
              throws,
            }),
            () => run(data[stringFormat]),
          );
        }
      }
    }
  }
  if (codec) {
    const date = new Date(0);
    const str = date.toISOString();
    for (const benchConfig of ensureArray(codec)) {
      const { encode, decode, note, optimizeType = libraryOptimizeType } = benchConfig;
      const id = crypto.randomUUID();
      bench.add(
        caseRegistry.add({
          type: "codec",
          optimizeType,
          libraryName,
          version,
          note,
          snippet: encode.snippet,
          codecType: "encode",
          codecId: id,
        }),
        () => encode.run(date),
      );
      bench.add(
        caseRegistry.add({
          type: "codec",
          optimizeType,
          libraryName,
          version,
          note,
          snippet: decode.snippet,
          codecType: "decode",
          codecId: id,
        }),
        () => decode.run(str),
      );
    }
  }
}

// Run benchmarks for this library and process results immediately
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
const codecResults: Record<
  string,
  Partial<Record<"encode" | "decode", { snippet: string; mean: number }>>
> = {};
for (const task of successTasks) {
  const entry = caseRegistry.get(task.name);
  if (!entry) continue;
  const { libraryName, note, version, snippet, throws, optimizeType } = entry;
  switch (entry.type) {
    case "initialization": {
      results.initialization.push({
        type: "initialization",
        id: task.name,
        libraryName,
        version,
        snippet,
        note,
        throws,
        mean: task.result.latency.mean,
        optimizeType,
      });
      break;
    }
    case "validation": {
      results.validation[entry.dataType].push({
        type: "validation",
        id: task.name,
        libraryName,
        version,
        snippet,
        note,
        throws,
        mean: task.result.latency.mean,
        optimizeType,
      });
      break;
    }
    case "parsing": {
      results.parsing[entry.dataType].push({
        type: "parsing",
        id: task.name,
        libraryName,
        version,
        snippet,
        note,
        throws,
        mean: task.result.latency.mean,
        optimizeType,
        errorType: entry.errorType,
      });
      break;
    }
    case "standard": {
      results.standard[entry.dataType].push({
        type: "standard",
        id: task.name,
        libraryName,
        version,
        snippet,
        note,
        mean: task.result.latency.mean,
        optimizeType,
        errorType: entry.errorType,
      });
      break;
    }
    case "string": {
      results.string[entry.stringFormat][entry.dataType].push({
        type: "string",
        id: task.name,
        libraryName,
        version,
        snippet,
        note,
        mean: task.result.latency.mean,
        optimizeType,
      });
      break;
    }
    case "codec": {
      codecResults[entry.codecId] ??= {};
      const codecResult = codecResults[entry.codecId]!;
      codecResult[entry.codecType] = {
        snippet,
        mean: task.result.latency.mean,
      };
      if (codecResult.encode && codecResult.decode) {
        results.codec.push({
          type: "codec",
          id: entry.codecId,
          libraryName,
          version,
          note: entry.note,
          encode: codecResult.encode,
          decode: codecResult.decode,
          optimizeType,
        });
      }
      break;
    }
  }
}

console.log(`  Completed: ${tasks.length} benchmarks`);

console.log(JSON.stringify(results));
