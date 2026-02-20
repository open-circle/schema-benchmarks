import * as fs from "node:fs/promises";
import * as path from "node:path";

import { errorData, successData } from "@schema-benchmarks/schemas";
import { libraries } from "@schema-benchmarks/schemas/libraries";
import { ensureArray, partition, unsafeEntries } from "@schema-benchmarks/utils";
import { Bench, type Task, type TaskResultCompleted } from "tinybench";

import { CaseRegistry } from "../bench/registry.ts";
import type { BenchResults } from "../results/types.ts";

const results: BenchResults = {
  initialization: [],
  validation: { valid: [], invalid: [] },
  parsing: { valid: [], invalid: [] },
};

const caseRegistry = new CaseRegistry();

function processResults(tasks: Array<Task>) {
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
    if (!entry) continue;
    const { libraryName, note, version, snippet, throws } = entry;
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
          optimizeType: entry.optimizeType,
        });
        break;
      }
      case "validation": {
        if (!entry.dataType) {
          console.error("Missing data type for validation bench:", entry);
          continue;
        }
        results.validation[entry.dataType].push({
          type: "validation",
          id: task.name,
          libraryName,
          version,
          snippet,
          note,
          throws,
          mean: task.result.latency.mean,
          optimizeType: entry.optimizeType,
        });
        break;
      }
      case "parsing": {
        if (!entry.dataType) {
          console.error("Missing data type for parsing bench:", entry);
          continue;
        }
        if (!entry.errorType) {
          console.error("Missing error type for parsing bench:", entry);
          continue;
        }
        results.parsing[entry.dataType].push({
          type: "parsing",
          id: task.name,
          libraryName,
          version,
          snippet,
          note,
          throws,
          mean: task.result.latency.mean,
          optimizeType: entry.optimizeType,
          errorType: entry.errorType,
        });
        break;
      }
    }
  }
}

// Run each library in its own Bench instance to allow GC between libraries
for (const getConfig of Object.values(libraries).toReversed()) {
  const { library, createContext, initialization, validation, parsing } = await getConfig();
  const { name: libraryName, optimizeType: libraryOptimizeType, version } = library;

  console.log(`\nBenchmarking: ${libraryName}`);

  // Create a fresh Bench for this library
  const bench = new Bench();
  bench.addEventListener("start", () => {
    console.log("Starting bench...");
  });
  bench.addEventListener("cycle", (event) => {
    console.log("Starting cycle", caseRegistry.get(event.task?.name ?? ""));
  });
  bench.addEventListener("complete", () => {
    console.log("Bench complete");
  });

  const context = await createContext();

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
      () => run(context),
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
          () => run(data, context),
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
            () => run(data, context),
          );
        }
      }
    }
  }

  // Run benchmarks for this library and process results immediately
  const tasks = await bench.run();
  processResults(tasks);

  console.log(`  Completed: ${tasks.length} benchmarks`);
  // bench and contexts go out of scope here and can be GC'd
  // but just in case, let's manually trigger GC if we can
  global.gc?.();
}

for (const array of [
  results.initialization,
  ...Object.values(results.validation),
  ...Object.values(results.parsing),
]) {
  array.sort((a, b) => a.mean - b.mean);
}

const outputPath = path.join(process.cwd(), "bench.json");
await fs.writeFile(outputPath, JSON.stringify(results));
