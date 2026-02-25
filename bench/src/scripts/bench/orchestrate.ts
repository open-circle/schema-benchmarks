import * as child_process from "node:child_process";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { promisify } from "node:util";

import { libraries } from "@schema-benchmarks/schemas/libraries";
import { unsafeEntries } from "@schema-benchmarks/utils";
import * as v from "valibot";

import type { BenchResults } from "../../results/types.ts";
import { benchResultsSchema, getEmptyResults } from "../../results/types.ts";

const sigintAc = new AbortController();
process.on("SIGINT", (signal) => {
  sigintAc.abort(signal);
});

const execFile = promisify(child_process.execFile);

const allResults: Array<BenchResults> = [];

function forward<T>(promise: child_process.PromiseWithChild<T>) {
  promise.child.stdout?.pipe(process.stdout);
  promise.child.stderr?.pipe(process.stderr);
  return promise;
}

for (const lib of Object.keys(libraries)) {
  const libResult = await forward(
    execFile(
      process.execPath,
      [path.resolve(process.cwd(), "./src/scripts/bench/library.ts"), `--lib=${lib}`],
      {
        signal: sigintAc.signal,
      },
    ),
  );
  const results = libResult.stdout.split("\n").slice(-3).filter(Boolean).pop();
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

await fs.writeFile(path.resolve(process.cwd(), "./bench.json"), JSON.stringify(merged));
