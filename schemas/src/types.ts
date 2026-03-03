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

export interface InitializationBenchmarkConfig extends BaseBenchmarkConfig {
  run: () => MaybePromise<NonNullable<unknown>>;
}

export interface ValidationBenchmarkConfig extends BaseBenchmarkConfig {
  run: (data: unknown) => MaybePromise<boolean>;
}

export const errorTypeSchema = v.picklist(["allErrors", "abortEarly"]);
export type ErrorType = v.InferOutput<typeof errorTypeSchema>;

export interface ParsingBenchmarkConfig<ParseResult = unknown> extends BaseBenchmarkConfig {
  run: (data: unknown) => MaybePromise<ParseResult>;
  validateResult: (result: NoInfer<ParseResult>) => boolean;
}

export interface StandardSchemaBenchmarkConfig extends Omit<
  BaseBenchmarkConfig,
  "throws" | "snippet"
> {
  schema: StandardSchemaV1<unknown, ProductData>;
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
  "duration",
  "email",
  "url",
  "uuid",
  "ipv4",
  "ipv6",
]);
export type StringFormat = v.InferOutput<typeof stringFormatSchema>;

export interface StringBenchmarkConfig extends BaseBenchmarkConfig {
  create: () => MaybePromise<(testString: string) => MaybePromise<boolean>>;
}

export interface StackBenchmarkConfig {
  throw: (data: unknown) => MaybePromise<never>;
  snippet: string;
}

export interface LibraryInfo {
  name: string;
  git: string;
  optimizeType: OptimizeType;
  version: string;
}

export interface BenchmarksConfig<ParseResult = unknown> {
  library: LibraryInfo;
  initialization: MaybeArray<InitializationBenchmarkConfig>;
  validation?: MaybeArray<ValidationBenchmarkConfig>;
  parsing?: Partial<Record<ErrorType, MaybeArray<ParsingBenchmarkConfig<ParseResult>>>>;
  standard?: Partial<Record<ErrorType, MaybeArray<StandardSchemaBenchmarkConfig>>>;
  string?: Partial<Record<StringFormat, StringBenchmarkConfig>>;
  stack?: StackBenchmarkConfig;
}

/* @__NO_SIDE_EFFECTS__ */
export function defineBenchmarks<TParseResult>(config: BenchmarksConfig<TParseResult>) {
  return config;
}

export class ShouldHaveThrownError extends Error {
  constructor() {
    super("Expected an error to be thrown, but none was thrown");
    this.name = "ShouldHaveThrownError";
  }
}

export function assertNotReached(): never {
  throw new ShouldHaveThrownError();
}
