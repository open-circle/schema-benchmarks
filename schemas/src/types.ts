import type { MaybeArray, MaybePromise } from "@schema-benchmarks/utils";
import type { StandardSchemaV1 } from "@standard-schema/spec";
import * as v from "valibot";

import type { ProductData } from "./data.ts";

export const optimizeTypeSchema = v.picklist(["none", "jit", "precompiled"]);
export type OptimizeType = v.InferOutput<typeof optimizeTypeSchema>;

export interface BaseBenchmarkConfig {
  optimizeType?: OptimizeType;
  snippet: string;
  note?: string;
  throws?: boolean;
}

export interface InitializationBenchmarkConfig<Context> extends BaseBenchmarkConfig {
  run: (context: Context) => MaybePromise<NonNullable<unknown>>;
}

export interface ValidationBenchmarkConfig<Context> extends BaseBenchmarkConfig {
  run: (data: unknown, context: Context) => MaybePromise<boolean>;
}

export const errorTypeSchema = v.picklist(["allErrors", "abortEarly"]);
export type ErrorType = v.InferOutput<typeof errorTypeSchema>;

export interface ParsingBenchmarkConfig<
  Context,
  ParseResult = unknown,
> extends BaseBenchmarkConfig {
  run: (data: unknown, context: Context) => MaybePromise<ParseResult>;
  validateResult: (result: NoInfer<ParseResult>) => boolean;
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

export const stringFormatSchema = v.picklist([
  "date-time",
  "date",
  "time",
  "email",
  "url",
  "uuid",
  "ipv4",
  "ipv6",
]);
export type StringFormat = v.InferOutput<typeof stringFormatSchema>;

export interface StringBenchmarkConfig<Context> extends BaseBenchmarkConfig {
  create: (context: Context) => MaybePromise<(testString: string) => MaybePromise<boolean>>;
}

export interface LibraryInfo {
  name: string;
  git: string;
  optimizeType: OptimizeType;
  version: string;
}

export interface BenchmarksConfig<Context, ParseResult = unknown> {
  library: LibraryInfo;
  createContext: () => MaybePromise<Context>;
  initialization: MaybeArray<InitializationBenchmarkConfig<Context>>;
  validation?: MaybeArray<ValidationBenchmarkConfig<Context>>;
  parsing?: Partial<Record<ErrorType, MaybeArray<ParsingBenchmarkConfig<Context, ParseResult>>>>;
  standard?: Partial<Record<ErrorType, MaybeArray<StandardSchemaBenchmarkConfig<Context>>>>;
  string?: Partial<Record<StringFormat, StringBenchmarkConfig<Context>>>;
}

/* @__PURE__ */
export function defineBenchmarks<const TContext, TParseResult>(
  config: BenchmarksConfig<TContext, TParseResult>,
) {
  return config;
}
