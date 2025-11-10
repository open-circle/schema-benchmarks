import * as fs from "node:fs/promises";
import * as path from "node:path";
import type { Task } from "@vitest/runner";
import { getNames, getTasks } from "@vitest/runner/utils";
import * as v from "valibot";
import type { BenchmarkResult } from "vitest";
import type { Reporter } from "vitest/reporters";
import { AbortType, DataType, LibraryType } from "../bench-types";

type VitestContext = NonNullable<Reporter["onInit"]> extends (
	ctx: infer T,
) => void
	? T
	: never;
type TestModules = Parameters<NonNullable<Reporter["onTestRunEnd"]>>[0];

const benchmarkFilename = /\/benchmarks\/(.*)\.bench\.ts$/;
// zod (jitless) -> ["zod", "jitless"]
const libraryWithNote = /^([\w-]+)(?:\s+\(([^)]+)\))?$/;

type LibraryName = string;
type LibraryNote = string;
export interface LibraryBenchmark {
	result: BenchmarkResult;
	name: LibraryName;
	note: LibraryNote;
}
interface LibraryBenchmarks {
	results: Record<LibraryName, Record<LibraryNote, LibraryBenchmark>>;
	ranked: { name: LibraryName; note: LibraryNote }[];
}
function addBenchmark(
	benchmarks: LibraryBenchmarks,
	name: LibraryName,
	note: LibraryNote,
	benchmark: BenchmarkResult,
) {
	// biome-ignore lint/suspicious/noAssignInExpressions: performance
	(benchmarks.results[name] ??= {})[note] = {
		result: benchmark,
		name: name,
		note,
	};
	benchmarks.ranked[benchmark.rank - 1] = { name, note };
}

export interface AllBenchmarks {
	initialization: Record<LibraryType, LibraryBenchmarks>;
	parsing: Record<
		DataType,
		Record<LibraryType, Record<AbortType, LibraryBenchmarks>>
	>;
	validation: Record<DataType, Record<LibraryType, LibraryBenchmarks>>;
}

const dataType = v.enum(DataType);
const libraryType = v.enum(LibraryType);
const abortType = v.enum(AbortType);

const initializationNames = v.tuple([libraryType]);
const parsingNames = v.tuple([dataType, libraryType, abortType]);
const validationNames = v.tuple([dataType, libraryType]);

export class CustomReporter implements Reporter {
	ctx: VitestContext = undefined as never;
	onInit(ctx: VitestContext) {
		this.ctx = ctx;
	}
	async onTestRunEnd(modules: TestModules) {
		const allBenchmarks: AllBenchmarks = {
			initialization: {
				[LibraryType.Runtime]: {
					results: {},
					ranked: [],
				},
				[LibraryType.Precompiled]: {
					results: {},
					ranked: [],
				},
			},
			parsing: {
				[DataType.Error]: {
					[LibraryType.Runtime]: {
						[AbortType.DoNot]: {
							results: {},
							ranked: [],
						},
						[AbortType.Do]: {
							results: {},
							ranked: [],
						},
					},
					[LibraryType.Precompiled]: {
						[AbortType.DoNot]: {
							results: {},
							ranked: [],
						},
						[AbortType.Do]: {
							results: {},
							ranked: [],
						},
					},
				},
				[DataType.Success]: {
					[LibraryType.Runtime]: {
						[AbortType.DoNot]: {
							results: {},
							ranked: [],
						},
						[AbortType.Do]: {
							results: {},
							ranked: [],
						},
					},
					[LibraryType.Precompiled]: {
						[AbortType.DoNot]: {
							results: {},
							ranked: [],
						},
						[AbortType.Do]: {
							results: {},
							ranked: [],
						},
					},
				},
			},
			validation: {
				[DataType.Error]: {
					[LibraryType.Runtime]: {
						results: {},
						ranked: [],
					},
					[LibraryType.Precompiled]: {
						results: {},
						ranked: [],
					},
				},
				[DataType.Success]: {
					[LibraryType.Runtime]: {
						results: {},
						ranked: [],
					},
					[LibraryType.Precompiled]: {
						results: {},
						ranked: [],
					},
				},
			},
		};
		const files = modules.map(
			(m) => (m as unknown as { task: Task }).task.file,
		);
		for (const file of files) {
			const match = file.filepath.match(benchmarkFilename);
			if (!match) continue;
			const benchName = match[1];
			const tasks = getTasks(file);
			for (const task of tasks) {
				if (task.type !== "test") continue;
				const suiteNames = getNames(task).slice(1, -1); // remove first (filepath) and last (task name)
				const [, libraryName, note = ""] =
					task.name.match(libraryWithNote) || [];
				if (!libraryName) continue;
				const benchmark = task.meta.benchmark && task.result?.benchmark;
				if (benchmark) {
					switch (benchName) {
						case "initialization": {
							const [libraryType] = v.parse(initializationNames, suiteNames);
							addBenchmark(
								allBenchmarks.initialization[libraryType],
								libraryName,
								note,
								benchmark,
							);
							break;
						}
						case "parsing": {
							const [dataType, libraryType, abortType] = v.parse(
								parsingNames,
								suiteNames,
							);
							addBenchmark(
								allBenchmarks.parsing[dataType][libraryType][abortType],
								libraryName,
								note,
								benchmark,
							);
							break;
						}
						case "validation": {
							const [dataType, libraryType] = v.parse(
								validationNames,
								suiteNames,
							);
							addBenchmark(
								allBenchmarks.validation[dataType][libraryType],
								libraryName,
								note,
								benchmark,
							);
							break;
						}
						default: {
							throw new Error(`Unhandled benchmark name: ${benchName}`);
						}
					}
				}
			}
		}
		const outputFile = path.resolve(this.ctx.config.root, "bench.json");
		await fs.writeFile(outputFile, JSON.stringify(allBenchmarks, null, 2));
	}
}
