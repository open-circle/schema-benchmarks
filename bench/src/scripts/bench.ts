import * as fs from "node:fs/promises";
import * as path from "node:path";
import { errorData, successData } from "@schema-benchmarks/schemas";
import { libraries } from "@schema-benchmarks/schemas/libraries";
import {
  ensureArray,
  partition,
  unsafeEntries,
} from "@schema-benchmarks/utils";
import {
  allBenches,
  benchCases,
  benchesInfo,
  getBench,
  getCaseKey,
} from "../bench/registry.ts";
import type { BenchResults } from "../results/types.ts";

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

for (const getConfig of Object.values(libraries)) {
  const { library, initialization, validation, parsing } = await getConfig();
  const { name: libraryName, type: libraryType, version } = library;

  for (const benchConfig of ensureArray(initialization)) {
    const { run, snippet, note } = benchConfig;
    const bench = getBench({ type: "initialization", libraryType });
    bench.add(
      getCaseKey(bench, {
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
        const bench = getBench({ type: "validation", libraryType, dataType });
        bench.add(
          getCaseKey(bench, {
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
          const bench = getBench({
            type: "parsing",
            libraryType,
            dataType,
            errorType,
          });
          bench.add(
            getCaseKey(bench, {
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

for (const bench of allBenches.values()) {
  const benchInfo = benchesInfo.get(bench);
  if (!benchInfo) continue;
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
    const entry = benchCases.get(bench)?.get(task.name);
    if (!entry) continue;
    switch (benchInfo.type) {
      case "initialization": {
        results.initialization[benchInfo.libraryType].push({
          id: task.name,
          ...entry,
          mean: task.result.mean,
        });
        break;
      }
      case "validation": {
        if (!benchInfo.dataType) {
          console.error("Missing data type for validation bench:", benchInfo);
          continue;
        }
        results.validation[benchInfo.libraryType][benchInfo.dataType].push({
          id: task.name,
          ...entry,
          mean: task.result.mean,
        });
        break;
      }
      case "parsing": {
        if (!benchInfo.dataType) {
          console.error("Missing data type for parsing bench:", benchInfo);
          continue;
        }
        if (!benchInfo.errorType) {
          console.error("Missing error type for parsing bench:", benchInfo);
          continue;
        }
        results.parsing[benchInfo.libraryType][benchInfo.dataType][
          benchInfo.errorType
        ].push({
          id: task.name,
          ...entry,
          mean: task.result.mean,
        });
        break;
      }
    }
  }
}

const outputPath = path.join(process.cwd(), "bench.json");
await fs.writeFile(outputPath, JSON.stringify(results));
