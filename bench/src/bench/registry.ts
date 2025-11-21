import type {
  BaseBenchmarkConfig,
  BenchmarksConfig,
  ErrorType,
  LibraryType,
} from "@schema-benchmarks/schemas";
import { getOrInsertComputed, serialize } from "@schema-benchmarks/utils";
import { Bench } from "tinybench";
import type { DataType } from "../results/types.ts";

export type BenchmarkType = Exclude<keyof BenchmarksConfig, "library">;

export interface BenchmarkConfigEntry extends BaseBenchmarkConfig {
  libraryName: string;
  version: string;
}

export interface BenchInfo {
  type: BenchmarkType;
  libraryType: LibraryType;
  errorType?: ErrorType;
  dataType?: DataType;
}

export const allBenches = new Map<string, Bench>();
export const benchesInfo = new WeakMap<Bench, BenchInfo>();
export const benchCases = new WeakMap<
  Bench,
  Map<string, BenchmarkConfigEntry>
>();

export function getBench(benchInfo: BenchInfo) {
  return getOrInsertComputed(allBenches, serialize(benchInfo), () => {
    const bench = new Bench();
    benchesInfo.set(bench, benchInfo);
    bench.addEventListener("start", () => {
      console.log("Starting bench:", benchInfo);
    });
    bench.addEventListener("cycle", (e) => {
      console.log(
        "Starting cycle:",
        benchCases.get(bench)?.get(e.task?.name ?? ""),
      );
    });
    bench.addEventListener("complete", () => {
      console.log("Complete");
      console.table(
        bench.table().map((row) => {
          if (!row) return row;
          const entry = benchCases
            .get(bench)
            ?.get(row?.["Task name"] as string);
          return {
            ...row,
            "Task name": `${entry?.libraryName ?? ""}${entry?.note ? ` (${entry.note})` : ""}`,
          };
        }),
      );
    });
    return bench;
  });
}

export const getCaseKey = (
  bench: Bench,
  entry: BenchmarkConfigEntry,
): string => {
  const id = crypto.randomUUID();
  getOrInsertComputed(benchCases, bench, () => new Map()).set(id, entry);
  return id;
};
