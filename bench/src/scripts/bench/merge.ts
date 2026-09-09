import * as fs from "node:fs/promises";
import * as path from "node:path";

import * as v from "valibot";

import type { BenchmarkType } from "#src/bench/registry.ts";
import { benchmarkTypeSchema } from "#src/bench/registry.ts";
import type { BenchResults } from "#src/results/types.ts";
import { benchResultsSchema, getEmptyResults } from "#src/results/types.ts";

const merged = getEmptyResults();

function mergeResult<Type extends BenchmarkType>(type: Type, results: Pick<BenchResults, Type>) {
  merged[type] = results[type];
}

for (const type of benchmarkTypeSchema.options) {
  const inputPath = path.resolve(process.cwd(), `./results/bench-${type}.json`);
  const results = v.parse(benchResultsSchema, JSON.parse(await fs.readFile(inputPath, "utf8")));
  mergeResult(type, results);
}

await fs.writeFile(path.resolve(process.cwd(), "./bench.json"), JSON.stringify(merged));
