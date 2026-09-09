import * as child_process from "node:child_process";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { parseArgs, promisify } from "node:util";

import { libraries } from "@schema-benchmarks/schemas/libraries";
import { unsafeEntries } from "@schema-benchmarks/utils";
import { forwardStd, getSigintSignal } from "@schema-benchmarks/utils/node";
import * as v from "valibot";

import { optionalBenchmarkTypeSchema } from "#src/bench/registry.ts";
import type { BenchResults } from "#src/results/types.ts";
import { benchResultsSchema, getEmptyResults } from "#src/results/types.ts";

const {
  values: { type, shard: shardValue },
} = parseArgs({
  options: {
    type: {
      type: "string",
      short: "t",
    },
    shard: {
      type: "string",
    },
  },
});

function parseShard(value: string) {
  const match = /^(\d+)\/(\d+)$/.exec(value);
  const index = Number(match?.[1]);
  const count = Number(match?.[2]);
  if (!match || count === 0 || index >= count) {
    throw new Error(`Invalid shard: ${value}`);
  }
  return { index, count };
}

if (!v.is(optionalBenchmarkTypeSchema, type)) {
  throw new Error(`Benchmark type not found: ${type}`);
}

const shard = type === "string" && shardValue ? parseShard(shardValue) : undefined;

const sigintSignal = getSigintSignal();

const execFile = promisify(child_process.execFile);

const allResults: Array<BenchResults> = [];
const libraryEntries = Object.entries(libraries).filter(
  (_, index) => !shard || index % shard.count === shard.index,
);

for (const [lib] of libraryEntries) {
  const libResult = await forwardStd(
    execFile(
      process.execPath,
      [
        path.resolve(process.cwd(), "./src/scripts/bench/library.ts"),
        `--lib=${lib}`,
        ...(type ? [`--type=${type}`] : []),
      ],
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

const outputName =
  type === "string" && shard ? `bench-string-${shard.index}.json` : `bench-${type}.json`;
const outputPath = type
  ? path.resolve(process.cwd(), `./results/${outputName}`)
  : path.resolve(process.cwd(), "./bench.json");
await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.writeFile(outputPath, JSON.stringify(merged));
