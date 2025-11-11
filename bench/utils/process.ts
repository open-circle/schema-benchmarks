import type { Bench, Task } from "tinybench";
import { partition } from ".";
import type { BenchMetaForType, MetaType } from "./registry";
import { registry } from "./registry";

export type LibraryType = "runtime" | "precompiled";
export type DataType = "success" | "error";
export type ErrorType = "abortEarly" | "allErrors" | "unknown";

export interface ProcessedResult {
  libraryName: string;
  note?: string;
  snippet: string;
  rank: number;
  period: number;
}

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

export interface ProcessedResults {
  initialization: Record<LibraryType, Array<ProcessedResult>>;
  parsing: Record<
    LibraryType,
    Record<DataType, Record<ErrorType, Array<ProcessedResult>>>
  >;
  validation: Record<LibraryType, Record<DataType, Array<ProcessedResult>>>;
}

const getEmptyResults = (): ProcessedResults => ({
  initialization: {
    runtime: [],
    precompiled: [],
  },
  parsing: {
    runtime: {
      success: {
        abortEarly: [],
        allErrors: [],
        unknown: [],
      },
      error: {
        abortEarly: [],
        allErrors: [],
        unknown: [],
      },
    },
    precompiled: {
      success: {
        abortEarly: [],
        allErrors: [],
        unknown: [],
      },
      error: {
        abortEarly: [],
        allErrors: [],
        unknown: [],
      },
    },
  },
  validation: {
    runtime: {
      success: [],
      error: [],
    },
    precompiled: {
      success: [],
      error: [],
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
      libraryName: caseMeta.libraryName,
      note: caseMeta.note,
      snippet: caseMeta.snippet,
      rank: index + 1,
      period: task.result.period,
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
