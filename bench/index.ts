import type { ProcessedResults } from "./utils/process";
import "./benchmarks/initialization.bench";
import "./benchmarks/validation.bench";
import "./benchmarks/parsing.bench";
import { processResults } from "./utils/process";
import { registry } from "./utils/registry";

export type { ProcessedResult, ProcessedResults } from "./utils/process";

export async function runBenchmarks(): Promise<ProcessedResults> {
	const benchResults = await registry.runBenches();
	return processResults(benchResults);
}
