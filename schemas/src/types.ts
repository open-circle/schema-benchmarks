import type { MaybeArray, MaybePromise } from "@schema-benchmarks/utils";
import type { StandardSchemaV1 } from "@standard-schema/spec";
import * as v from "valibot";

import { ProductData } from "./data";

export const optimizeTypeSchema = /* @__PURE__ */ v.picklist(["none", "jit", "precompiled"]);
export type OptimizeType = v.InferOutput<typeof optimizeTypeSchema>;

export interface BaseBenchmarkConfig {
  optimizeType?: OptimizeType;
  snippet: string;
  note?: string;
  throws?: boolean;
}

export interface InitializationBenchmarkConfig<Context> extends BaseBenchmarkConfig {
  run: (context: Context) => MaybePromise<unknown>;
}

export interface ValidationBenchmarkConfig<Context> extends BaseBenchmarkConfig {
  run: (data: unknown, context: Context) => MaybePromise<unknown>;
}

export const errorTypeSchema = /* @__PURE__ */ v.picklist(["allErrors", "abortEarly"]);
export type ErrorType = v.InferOutput<typeof errorTypeSchema>;

export interface ParsingBenchmarkConfig<Context> extends BaseBenchmarkConfig {
  run: (data: unknown, context: Context) => MaybePromise<unknown>;
}

export interface StandardSchemaBenchmarkConfig<Context> extends Omit<
  BaseBenchmarkConfig,
  "throws" | "snippet"
> {
  getSchema: (context: Context) => MaybePromise<StandardSchemaV1<any, ProductData>>;
  /**
   * Provide if the schema needs an adapter to become a standard schema.
   * @example
   * "upfetch(url, { schema })"
   */
  snippet?: string;
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
  createContext: () => MaybePromise<Context>;
  initialization: MaybeArray<InitializationBenchmarkConfig<Context>>;
  validation?: MaybeArray<ValidationBenchmarkConfig<Context>>;
  parsing?: Partial<Record<ErrorType, MaybeArray<ParsingBenchmarkConfig<Context>>>>;
  standard?: Partial<Record<ErrorType, MaybeArray<StandardSchemaBenchmarkConfig<Context>>>>;
}

/* @__PURE__ */
export function defineBenchmarks<const TContext>(config: BenchmarksConfig<TContext>) {
  return config;
}
