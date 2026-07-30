import type { MaybeArray, MaybePromise } from "@schema-benchmarks/utils";
import type { StandardJSONSchemaV1, StandardSchemaV1 } from "@standard-schema/spec";
import * as v from "valibot";

import type { ProductData } from "./data.ts";

export const optimizeTypeSchema = /* @__PURE__ */ v.picklist(["none", "jit", "precompiled"]);
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

export const errorTypeSchema = /* @__PURE__ */ v.picklist(["allErrors", "abortEarly"]);
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

/** The JSON schema targets a library can be asked to generate. */
export const jsonSchemaTargetSchema = /* @__PURE__ */ v.picklist([
  "draft-2020-12",
  "draft-07",
  "openapi-3.0",
]);
export type JsonSchemaTarget = v.InferOutput<typeof jsonSchemaTargetSchema>;

/** A JSON schema can be generated for the input or the output type of a schema. */
export const jsonSchemaDirectionSchema = /* @__PURE__ */ v.picklist(["input", "output"]);
export type JsonSchemaDirection = v.InferOutput<typeof jsonSchemaDirectionSchema>;

/** Where a library's JSON schema comes from. */
export const jsonSchemaSourceSchema = /* @__PURE__ */ v.picklist([
  "runtime",
  "precompiled",
  "is-json-schema",
]);
export type JsonSchemaSource = v.InferOutput<typeof jsonSchemaSourceSchema>;

/**
 * How a library provides the [Standard JSON Schema](https://standardschema.dev/json-schema)
 * interface, which lets tools generate a JSON schema without specialising for each library.
 */
export const standardJsonSchemaSupportSchema = /* @__PURE__ */ v.picklist([
  "native",
  "native-opt-in",
  "separate-package",
  "none",
]);
export type StandardJsonSchemaSupport = v.InferOutput<typeof standardJsonSchemaSupportSchema>;

export interface JsonSchemaOptions {
  target: JsonSchemaTarget;
  direction: JsonSchemaDirection;
}

interface StandardJsonSchemaConfig {
  /** Anything but `none` has to come with a schema, so the claim can be checked. */
  support: Exclude<StandardJsonSchemaSupport, "none">;
  /** The schema exposing `~standard.jsonSchema`, which should convert what `generate` converts. */
  schema: StandardJSONSchemaV1;
}

export interface JsonSchemaBenchmarkConfig extends Omit<BaseBenchmarkConfig, "throws" | "snippet"> {
  /**
   * Generates a JSON schema of the schema's input or output type, using whichever API the library
   * provides. Throws for anything it can't convert, which is recorded as unsupported.
   */
  generate: (options: JsonSchemaOptions) => object;
  /** The call being benchmarked, which usually depends on the target and direction. */
  snippet: (options: JsonSchemaOptions) => string;
  /**
   * Where the JSON schema comes from:
   * - `runtime`: the library converts the schema when asked
   * - `precompiled`: it's generated at build time, so there's nothing to do at runtime
   * - `is-json-schema`: the library's schemas are JSON Schema already, so there's nothing to convert
   *
   * Anything but `runtime` is a constant, and isn't benchmarked.
   */
  source: JsonSchemaSource;
  /** Provide if the library, or a separate package, implements the Standard JSON Schema interface. */
  standardJsonSchema?: StandardJsonSchemaConfig;
}

/** Libraries are expected to throw for targets they don't support. */
export function assertJsonSchemaTarget<Supported extends JsonSchemaTarget>(
  target: JsonSchemaTarget,
  supported: ReadonlyArray<Supported>,
): asserts target is Supported {
  if (!supported.includes(target as Supported)) {
    throw new Error(`Unsupported JSON Schema target: ${target}`);
  }
}

export function assertJsonSchemaDirection<Supported extends JsonSchemaDirection>(
  direction: JsonSchemaDirection,
  supported: ReadonlyArray<Supported>,
): asserts direction is Supported {
  if (!supported.includes(direction as Supported)) {
    throw new Error(`No JSON schema can be generated for the direction: ${direction}`);
  }
}

export const stringFormatSchema = /* @__PURE__ */ v.picklist([
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

export interface CodecBenchmarkConfig extends Omit<BaseBenchmarkConfig, "snippet"> {
  encode: { run: (data: bigint) => MaybePromise<string>; snippet: string };
  decode: { run: (data: string) => MaybePromise<bigint>; snippet: string };
  acceptsUnknown?: boolean;
}

export interface LibraryInfo {
  name: string;
  optimizeType: OptimizeType;
  version: string;
}

export interface BenchmarksConfig<ParseResult = unknown> {
  library: LibraryInfo;
  initialization?: MaybeArray<InitializationBenchmarkConfig>;
  validation?: MaybeArray<ValidationBenchmarkConfig>;
  parsing?: Partial<Record<ErrorType, MaybeArray<ParsingBenchmarkConfig<ParseResult>>>>;
  standard?: Partial<Record<ErrorType, MaybeArray<StandardSchemaBenchmarkConfig>>>;
  jsonSchema?: MaybeArray<JsonSchemaBenchmarkConfig>;
  string?: Partial<Record<StringFormat, StringBenchmarkConfig>>;
  stack?: StackBenchmarkConfig;
  codec?: MaybeArray<CodecBenchmarkConfig>;
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
