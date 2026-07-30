import * as child_process from "node:child_process";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { promisify } from "node:util";

import { libraries } from "@schema-benchmarks/schemas/libraries";
import { unsafeEntries } from "@schema-benchmarks/utils";
import { forwardStd, getSigintSignal } from "@schema-benchmarks/utils/node";
import * as v from "valibot";

import type { BenchResults } from "../../results/types.ts";
import { benchResultsSchema, getEmptyResults } from "../../results/types.ts";

const sigintSignal = getSigintSignal();

const execFile = promisify(child_process.execFile);

const allResults: Array<BenchResults> = [];

for (const lib of Object.keys(libraries)) {
  const libResult = await forwardStd(
    execFile(
      process.execPath,
      [path.resolve(process.cwd(), "./src/scripts/bench/library.ts"), `--lib=${lib}`],
      { signal: sigintSignal },
    ),
  );
  const results = libResult.stdout.split("\n").slice(-3).findLast(Boolean);
  if (!results) throw new Error(`No results for ${lib}`);
  allResults.push(v.parse(benchResultsSchema, JSON.parse(results)));
}

const merged = getEmptyResults();

for (const results of allResults) {
  merged.initialization.push(...results.initialization);
  for (const [dataType, data] of unsafeEntries(results.validation)) {
    merged.validation[dataType].push(...data);
  }
  for (const [dataType, data] of unsafeEntries(results.parsing)) {
    merged.parsing[dataType].push(...data);
  }
  for (const [dataType, data] of unsafeEntries(results.standard)) {
    merged.standard[dataType].push(...data);
  }
  for (const [format, formatResults] of unsafeEntries(results.string)) {
    for (const [dataType, data] of unsafeEntries(formatResults)) {
      merged.string[format][dataType].push(...data);
    }
  }
  merged.codec.push(...results.codec);
}

for (const array of [
  merged.initialization,
  ...Object.values(merged.validation),
  ...Object.values(merged.parsing),
  ...Object.values(merged.standard),
  ...Object.values(merged.string).flatMap((formatResults) => Object.values(formatResults)),
]) {
  array.sort((a, b) => a.mean - b.mean);
}

merged.codec.sort((a, b) => a.encode.mean - b.encode.mean);

await fs.writeFile(path.resolve(process.cwd(), "./bench.json"), JSON.stringify(merged));
