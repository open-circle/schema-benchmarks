import * as fs from "node:fs/promises";
import * as path from "node:path";

import { unsafeEntries } from "@schema-benchmarks/utils";
import * as v from "valibot";

import type { BenchmarkType } from "#src/bench/registry.ts";
import { benchmarkTypeSchema } from "#src/bench/registry.ts";
import type { BenchResults } from "#src/results/types.ts";
import { benchResultsSchema, getEmptyResults } from "#src/results/types.ts";

const merged = getEmptyResults();

function mergeResult<Type extends BenchmarkType>(type: Type, results: Pick<BenchResults, Type>) {
  merged[type] = results[type];
}
const resultsDir = path.resolve(process.cwd(), "./results");
const resultFiles = await fs.readdir(resultsDir);

for (const type of benchmarkTypeSchema.options) {
  const inputPaths =
    type === "string"
      ? resultFiles
          .filter((fileName) => /^bench-string-\d+\.json$/.test(fileName))
          // oxlint-disable-next-line unicorn/no-array-sort
          .sort()
          .map((fileName) => path.join(resultsDir, fileName))
      : [path.join(resultsDir, `bench-${type}.json`)];
  if (type === "string" && inputPaths.length === 0) {
    inputPaths.push(path.join(resultsDir, "bench-string.json"));
  }

  for (const inputPath of inputPaths) {
    const results = v.parse(benchResultsSchema, JSON.parse(await fs.readFile(inputPath, "utf8")));
    if (type === "string") {
      for (const [format, formatResults] of unsafeEntries(results.string)) {
        for (const [dataType, data] of unsafeEntries(formatResults)) {
          merged.string[format][dataType].push(...data);
        }
      }
    } else {
      mergeResult(type, results);
    }
  }
}

await fs.writeFile(path.resolve(process.cwd(), "./bench.json"), JSON.stringify(merged));
