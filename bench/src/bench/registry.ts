import type {
  BenchmarksConfig,
  ErrorType,
  LibraryType,
} from "@schema-benchmarks/schemas";
import {
  type Compute,
  getOrInsertComputed,
  type MaybeArray,
  serialize,
} from "@schema-benchmarks/utils";
import { Bench } from "tinybench";
import type { DataType } from "../results/types.ts";

export type BenchmarkType = Exclude<keyof BenchmarksConfig, "library">;

export type BenchmarkConfigEntry = Compute<
  {
    [Type in BenchmarkType]: Type extends "parsing"
      ? {
          [EType in ErrorType]?: NonNullable<
            NonNullable<BenchmarksConfig[Type]>[EType]
          > extends MaybeArray<infer T>
            ? Compute<Omit<T, "run"> & { errorType: EType }>
            : never;
        }[ErrorType]
      : NonNullable<BenchmarksConfig[Type]> extends MaybeArray<infer T>
        ? Omit<T, "run">
        : never;
  }[BenchmarkType] & {
    libraryName: string;
    version: string;
  }
>;

export interface BenchInfo {
  type: BenchmarkType;
  libraryType: LibraryType;
  errorType?: ErrorType;
  dataType?: DataType;
}

export const allBenches = new Map<string, Bench>();
export const benchesInfo = new Map<Bench, BenchInfo>();
export const benchCases = new Map<Bench, Map<string, BenchmarkConfigEntry>>();

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
      console.table(bench.table());
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
