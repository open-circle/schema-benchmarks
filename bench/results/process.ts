import { partition } from "@schema-benchmarks/utils";
import type { Bench, Task } from "tinybench";
import type { BenchMetaForType, MetaType } from "../utils/registry";
import { registry } from "../utils/registry";
import type { ProcessedResult, ProcessedResults } from "./types";

const selector: {
  [Type in MetaType]: (
    results: ProcessedResults,
    benchMeta: BenchMetaForType<Type>,
  ) => Array<ProcessedResult>;
} = {
  initialization(results, { libraryType }) {
    return results.initialization[libraryType];
  },
  validation(results, { libraryType, dataType }) {
    return results.validation[libraryType][dataType];
  },
  parse(results, { libraryType, dataType, abortType }) {
    return results.parsing[libraryType][dataType][abortType];
  },
};

const getEmptyResults = (): ProcessedResults => ({
  initialization: {
    runtime: [],
    precompiled: [],
  },
  parsing: {
    runtime: {
      valid: {
        abortEarly: [],
        allErrors: [],
      },
      invalid: {
        abortEarly: [],
        allErrors: [],
      },
    },
    precompiled: {
      valid: {
        abortEarly: [],
        allErrors: [],
      },
      invalid: {
        abortEarly: [],
        allErrors: [],
      },
    },
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
});

function processResult(
  results: ProcessedResults,
  bench: Bench,
  tasks: Array<Task>,
) {
  const benchMeta = registry.getBenchMeta(bench);
  const benchResults = selector[benchMeta.type](results, benchMeta as never);
  const [successfulTasks, erroredTasks] = partition(
    tasks,
    (task) => !!task.result && !task.result.error,
  );

  if (erroredTasks.length) {
    console.error(
      "Errored tasks",
      benchMeta,
      erroredTasks.map((task) => registry.getCaseMeta(task.name)),
    );
  }

  successfulTasks.sort((a, b) => {
    if (!a.result) return 1;
    if (!b.result) return -1;
    return a.result.mean - b.result.mean;
  });

  for (let index = 0; index < successfulTasks.length; index++) {
    const task = successfulTasks[index];
    if (!task?.result) continue;
    const caseMeta = registry.getCaseMeta(task.name);

    benchResults[index] = {
      id: task.name,
      libraryName: caseMeta.libraryName,
      note: caseMeta.note,
      snippet: caseMeta.snippet,
      rank: index + 1,
      mean: task.result.mean,
    };
  }
}

export function processResults(results: Array<readonly [Bench, Array<Task>]>) {
  const processedResults = getEmptyResults();
  for (const [bench, tasks] of results) {
    processResult(processedResults, bench, tasks);
  }
  return processedResults;
}
