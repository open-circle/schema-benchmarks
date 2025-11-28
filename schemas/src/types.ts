import type { MaybeArray } from "@schema-benchmarks/utils";
import * as v from "valibot";

export const libraryTypeSchema = v.picklist(["runtime", "precompiled"]);
export type LibraryType = v.InferOutput<typeof libraryTypeSchema>;

export interface BaseBenchmarkConfig {
  snippet: string;
  note?: string;
}

export interface InitializationBenchmarkConfig<Context>
  extends BaseBenchmarkConfig {
  run: (context: Context) => unknown | Promise<unknown>;
}

export interface ValidationBenchmarkConfig<Context>
  extends BaseBenchmarkConfig {
  run: (data: unknown, context: Context) => unknown | Promise<unknown>;
}

export const errorTypeSchema = v.picklist(["allErrors", "abortEarly"]);
export type ErrorType = v.InferOutput<typeof errorTypeSchema>;

export interface ParsingBenchmarkConfig<Context> extends BaseBenchmarkConfig {
  run: (data: unknown, context: Context) => unknown | Promise<unknown>;
}

export interface LibraryInfo {
  name: string;
  type: LibraryType;
  version: string;
}

export type BenchmarkConfig<Context> =
  | InitializationBenchmarkConfig<Context>
  | ValidationBenchmarkConfig<Context>
  | ParsingBenchmarkConfig<Context>;

export interface BenchmarksConfig<Context> {
  library: LibraryInfo;
  createContext: () => Context;
  initialization: MaybeArray<InitializationBenchmarkConfig<Context>>;
  validation?: MaybeArray<ValidationBenchmarkConfig<Context>>;
  parsing?: Partial<
    Record<ErrorType, MaybeArray<ParsingBenchmarkConfig<Context>>>
  >;
}

export function defineBenchmarks<const TContext>(
  config: BenchmarksConfig<TContext>,
) {
  return config;
}
