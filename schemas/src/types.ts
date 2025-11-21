import type { MaybeArray } from "@schema-benchmarks/utils";
import * as v from "valibot";

export const libraryTypeSchema = v.picklist(["runtime", "precompiled"]);
export type LibraryType = v.InferOutput<typeof libraryTypeSchema>;

interface BaseBenchmarkConfig {
  snippet: string;
  note?: string;
}

export interface InitializationBenchmarkConfig extends BaseBenchmarkConfig {
  run: () => unknown | Promise<unknown>;
}

export interface ValidationBenchmarkConfig extends BaseBenchmarkConfig {
  run: (data: unknown) => unknown | Promise<unknown>;
}

export const errorTypeSchema = v.picklist(["allErrors", "abortEarly"]);
export type ErrorType = v.InferOutput<typeof errorTypeSchema>;

export interface ParsingBenchmarkConfig extends BaseBenchmarkConfig {
  run: (data: unknown) => unknown | Promise<unknown>;
}

export interface LibraryInfo {
  name: string;
  type: LibraryType;
  version: string;
}

export type BenchmarkConfig =
  | InitializationBenchmarkConfig
  | ValidationBenchmarkConfig
  | ParsingBenchmarkConfig;

export interface BenchmarksConfig {
  library: LibraryInfo;
  initialization: MaybeArray<InitializationBenchmarkConfig>;
  validation?: MaybeArray<ValidationBenchmarkConfig>;
  parsing?: Partial<Record<ErrorType, MaybeArray<ParsingBenchmarkConfig>>>;
}

export function defineBenchmarks<const TConfig extends BenchmarksConfig>(
  config: TConfig,
) {
  return config;
}
