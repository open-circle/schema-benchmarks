import type { MaybeArray } from "@schema-benchmarks/utils";
import * as v from "valibot";

export const optimizeTypeSchema = /* @__PURE__ */ v.picklist([
  "none",
  "jit",
  "precompiled",
]);
export type OptimizeType = v.InferOutput<typeof optimizeTypeSchema>;

export interface BaseBenchmarkConfig {
  optimizeType?: OptimizeType;
  snippet: string;
  note?: string;
  throws?: boolean;
}

export interface InitializationBenchmarkConfig<Context>
  extends BaseBenchmarkConfig {
  run: (context: Context) => unknown | Promise<unknown>;
}

export interface ValidationBenchmarkConfig<Context>
  extends BaseBenchmarkConfig {
  run: (data: unknown, context: Context) => unknown | Promise<unknown>;
}

export const errorTypeSchema = /* @__PURE__ */ v.picklist([
  "allErrors",
  "abortEarly",
]);
export type ErrorType = v.InferOutput<typeof errorTypeSchema>;

export interface ParsingBenchmarkConfig<Context> extends BaseBenchmarkConfig {
  run: (data: unknown, context: Context) => unknown | Promise<unknown>;
}

export interface LibraryInfo {
  name: string;
  git: string;
  optimizeType: OptimizeType;
  version: string;
}

export type BenchmarkConfig<Context> =
  | InitializationBenchmarkConfig<Context>
  | ValidationBenchmarkConfig<Context>
  | ParsingBenchmarkConfig<Context>;

export interface BenchmarksConfig<Context> {
  library: LibraryInfo;
  createContext: () => Context | Promise<Context>;
  initialization: MaybeArray<InitializationBenchmarkConfig<Context>>;
  validation?: MaybeArray<ValidationBenchmarkConfig<Context>>;
  parsing?: Partial<
    Record<ErrorType, MaybeArray<ParsingBenchmarkConfig<Context>>>
  >;
}

/* @__PURE__ */
export function defineBenchmarks<const TContext>(
  config: BenchmarksConfig<TContext>,
) {
  return config;
}
