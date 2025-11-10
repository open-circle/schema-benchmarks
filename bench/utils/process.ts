import type { Bench, Task, TaskResult } from "tinybench";
import type { BenchMetaForType, MetaType } from "./registry";
import { registry } from "./registry";

export type LibraryType = "runtime" | "precompiled";
export type DataType = "success" | "error";
export type ErrorType = "abortEarly" | "allErrors" | "unknown";

interface ProcessedResult {
	libraryName: string;
	note?: string;
	result: Readonly<TaskResult>;
	rank: number;
}

type LibraryResults = Record<string, ProcessedResult[]>;
type BenchResult = {
	results: LibraryResults;
	rankedLibraries: { libraryName: string; note?: string }[];
};

const selector: {
	[Type in MetaType]: (
		results: ProcessedResults,
		benchMeta: BenchMetaForType<Type>,
	) => BenchResult;
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

const getEmptyBenchResult = (): BenchResult => ({
	results: {},
	rankedLibraries: [],
});

export interface ProcessedResults {
	initialization: Record<LibraryType, BenchResult>;
	parsing: Record<
		LibraryType,
		Record<DataType, Record<ErrorType, BenchResult>>
	>;
	validation: Record<LibraryType, Record<DataType, BenchResult>>;
}

const getEmptyResults = (): ProcessedResults => ({
	initialization: {
		runtime: getEmptyBenchResult(),
		precompiled: getEmptyBenchResult(),
	},
	parsing: {
		runtime: {
			success: {
				abortEarly: getEmptyBenchResult(),
				allErrors: getEmptyBenchResult(),
				unknown: getEmptyBenchResult(),
			},
			error: {
				abortEarly: getEmptyBenchResult(),
				allErrors: getEmptyBenchResult(),
				unknown: getEmptyBenchResult(),
			},
		},
		precompiled: {
			success: {
				abortEarly: getEmptyBenchResult(),
				allErrors: getEmptyBenchResult(),
				unknown: getEmptyBenchResult(),
			},
			error: {
				abortEarly: getEmptyBenchResult(),
				allErrors: getEmptyBenchResult(),
				unknown: getEmptyBenchResult(),
			},
		},
	},
	validation: {
		runtime: {
			success: getEmptyBenchResult(),
			error: getEmptyBenchResult(),
		},
		precompiled: {
			success: getEmptyBenchResult(),
			error: getEmptyBenchResult(),
		},
	},
});

function processResult(results: ProcessedResults, bench: Bench, tasks: Task[]) {
	const benchMeta = registry.getBenchMeta(bench);
	tasks.sort((a, b) => {
		if (!a.result) return 1;
		if (!b.result) return -1;
		return a.result.mean - b.result.mean;
	});

	for (let index = 0; index < tasks.length; index++) {
		const task = tasks[index];
		if (!task?.result) return;
		const caseMeta = registry.getCaseMeta(task.name);
		const benchResult = selector[caseMeta.type](results, benchMeta as never);
		// biome-ignore lint/suspicious/noAssignInExpressions: performance
		(benchResult.results[caseMeta.libraryName] ??= []).push({
			libraryName: caseMeta.libraryName,
			note: caseMeta.note,
			result: task.result,
			rank: index + 1,
		});
		benchResult.rankedLibraries[index] = {
			libraryName: caseMeta.libraryName,
			note: caseMeta.note,
		};
	}
}

export function processResults(results: Array<readonly [Bench, Task[]]>) {
	const processedResults = getEmptyResults();
	for (const [bench, tasks] of results) {
		processResult(processedResults, bench, tasks);
	}
	return processedResults;
}
