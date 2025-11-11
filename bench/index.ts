import type { ProcessedResults } from "./utils/process";
import "./benchmarks/initialization.bench";
import "./benchmarks/validation.bench";
import "./benchmarks/parsing.bench";
import { processResults } from "./utils/process";
import { registry } from "./utils/registry";

export type { ProcessedResults };

export async function runBenchmarks(): Promise<ProcessedResults> {
	const benchResults = await registry.runBenches();
	return processResults(benchResults);
}
