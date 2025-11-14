import * as fs from "node:fs/promises";
import * as path from "node:path";
import { processResults } from "./results/process";
import type { BenchResults } from "./results/types";
import { registry } from "./utils/registry";
import "./benchmarks/initialization.bench";
import "./benchmarks/validation.bench";
import "./benchmarks/parsing.bench";

async function runBenchmarks(): Promise<BenchResults> {
  const benchResults = await registry.runBenches();
  return processResults(benchResults);
}

runBenchmarks().then(async (results) => {
  const outputPath = path.join(__dirname, "bench.json");
  await fs.writeFile(outputPath, JSON.stringify(results));
});
