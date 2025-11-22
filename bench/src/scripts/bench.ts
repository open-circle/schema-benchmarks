import * as fs from "node:fs/promises";
import * as path from "node:path";
import { errorData, successData } from "@schema-benchmarks/schemas";
import { libraries } from "@schema-benchmarks/schemas/libraries";
import {
  ensureArray,
  partition,
  unsafeEntries,
} from "@schema-benchmarks/utils";
import { Bench } from "tinybench";
import { CaseRegistry } from "../bench/registry.ts";
import type { BenchResult, BenchResults } from "../results/types.ts";

const results: BenchResults = {
  initialization: {
    runtime: [],
    precompiled: [],
  },
  validation: {
    runtime: {
      valid: [],
      invalid: [],
    },
    precompiled: {
      valid: [],
      invalid: [],
    },
  },
  parsing: {
    runtime: {
      valid: {
        allErrors: [],
        abortEarly: [],
      },
      invalid: {
        allErrors: [],
        abortEarly: [],
      },
    },
    precompiled: {
      valid: {
        allErrors: [],
        abortEarly: [],
      },
      invalid: {
        allErrors: [],
        abortEarly: [],
      },
    },
  },
};

const bench = new Bench();
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

for (const getConfig of Object.values(libraries)) {
  const { library, initialization, validation, parsing } = await getConfig();
  const { name: libraryName, type: libraryType, version } = library;

  for (const benchConfig of ensureArray(initialization)) {
    const { run, snippet, note } = benchConfig;
    bench.add(
      caseRegistry.add({
        type: "initialization",
        libraryType,
        libraryName,
        version,
        snippet,
        note,
      }),
      run,
    );
  }
  if (validation) {
    for (const [dataType, data] of [
      ["valid", successData],
      ["invalid", errorData],
    ] as const) {
      for (const benchConfig of ensureArray(validation)) {
        const { run, snippet, note } = benchConfig;
        bench.add(
          caseRegistry.add({
            type: "validation",
            libraryType,
            dataType,
            libraryName,
            version,
            snippet,
            note,
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
          const { run, snippet, note } = benchConfig;
          bench.add(
            caseRegistry.add({
              type: "parsing",
              libraryType,
              dataType,
              errorType,
              libraryName,
              version,
              snippet,
              note,
            }),
            () => run(data),
          );
        }
      }
    }
  }
}

const tasks = await bench.run();
const [successTasks, errorTasks] = partition(
  tasks,
  (task): task is typeof task & { result: NonNullable<typeof task.result> } =>
    !!task.result && !task.result.error,
);
if (errorTasks.length) {
  console.error(
    "Errors:",
    errorTasks.map((task) => task.result?.error),
  );
}
for (const task of successTasks) {
  const entry = caseRegistry.get(task.name);
  if (!entry) continue;
  const { libraryName, note, version, snippet } = entry;
  switch (entry.type) {
    case "initialization": {
      results.initialization[entry.libraryType].push({
        id: task.name,
        libraryName,
        version,
        snippet,
        note,
        mean: task.result.mean,
      });
      break;
    }
    case "validation": {
      if (!entry.dataType) {
        console.error("Missing data type for validation bench:", entry);
        continue;
      }
      results.validation[entry.libraryType][entry.dataType].push({
        id: task.name,
        libraryName,
        version,
        snippet,
        note,
        mean: task.result.mean,
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
      results.parsing[entry.libraryType][entry.dataType][entry.errorType].push({
        id: task.name,
        libraryName,
        version,
        snippet,
        note,
        mean: task.result.mean,
      });
      break;
    }
  }
}

for (const array of ([] as Array<Array<BenchResult>>).concat(
  Object.values(results.initialization),
  Object.values(results.validation).flatMap((v) => Object.values(v)),
  Object.values(results.parsing)
    .flatMap((v) => Object.values(v))
    .flatMap((v) => Object.values(v)),
)) {
  array.sort((a, b) => a.mean - b.mean);
}

const outputPath = path.join(process.cwd(), "bench.json");
await fs.writeFile(outputPath, JSON.stringify(results));
