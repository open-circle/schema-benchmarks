import type {
  ComplianceContext,
  ComplianceFn,
  ComplianceTarget,
} from "@schema-benchmarks/json-schema-tests/types";
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
export const jsonSchemaConversionTargetSchema = /* @__PURE__ */ v.picklist([
  "draft-2020-12",
  "draft-07",
  "openapi-3.0",
]);
export type JsonSchemaConversionTarget = v.InferOutput<typeof jsonSchemaConversionTargetSchema>;

/** A JSON schema can be generated for the input or the output type of a schema. */
export const jsonSchemaDirectionSchema = /* @__PURE__ */ v.picklist(["input", "output"]);
export type JsonSchemaDirection = v.InferOutput<typeof jsonSchemaDirectionSchema>;

/**
 * How a library provides the capability to generate a JSON schema of a schema's input or output type.
 */
export const jsonSourceSchema = /* @__PURE__ */ v.picklist(["native", "opt-in", "package"]);
export type JsonSource = v.InferOutput<typeof jsonSourceSchema>;

export interface ToJsonSchemaOptions {
  target: JsonSchemaConversionTarget;
  direction: JsonSchemaDirection;
}

interface NativeSourceConfig {
  type: Exclude<JsonSource, "package">;
  package?: never;
}

interface PackageSourceConfig {
  /** The library doesn't implement the interface, but a separate package does. */
  type: "package";
  /** The package needed. */
  package: string;
}

export type SourceConfig = NativeSourceConfig | PackageSourceConfig;

type StandardJsonSourceConfig = SourceConfig & {
  /** The schema exposing `~standard.jsonSchema` */
  schema: StandardJSONSchemaV1;
};

export interface SchemaConversionToJsonConfig extends Omit<
  BaseBenchmarkConfig,
  "throws" | "snippet"
> {
  /**
   * Generates a JSON schema of the schema's input or output type, using whichever API the library
   * provides. Throws for anything it can't convert, which is recorded as unsupported.
   */
  generate: (options: ToJsonSchemaOptions) => object;
  /** The call being benchmarked, which usually depends on the target and direction. */
  snippet: (options: ToJsonSchemaOptions) => string;
  source: SourceConfig;
  /** Provide if the library, or a separate package, implements the Standard JSON Schema interface. */
  standardJsonSchema?: StandardJsonSourceConfig;
}

export const complianceTypeSchema = /* @__PURE__ */ v.picklist([
  "validation",
  "semantics",
  "roundtrip",
]);
export type ComplianceType = v.InferOutput<typeof complianceTypeSchema>;

export interface BaseComplianceBenchmarkConfig extends Omit<
  BaseBenchmarkConfig,
  "throws" | "snippet"
> {
  source: SourceConfig;
  snippet: (target: ComplianceTarget) => string;
}

export interface ComplianceBenchmarkConfig extends BaseComplianceBenchmarkConfig {
  run: ComplianceFn;
}

export interface RoundtripComplianceBenchmarkConfig extends BaseComplianceBenchmarkConfig {
  // convert the schema and then back again
  run: (schema: {} | boolean, context: ComplianceContext) => MaybePromise<{} | boolean>;
}

export interface SchemaConversionFromJsonConfig extends Omit<
  BaseBenchmarkConfig,
  "throws" | "snippet"
> {
  /**
   * Converts a JSON schema into a library's schema type, using whichever API the library provides.
   * Throws for anything it can't convert, which is recorded as unsupported.
   */
  generate: (jsonSchema: {}) => unknown;
  /** The call being benchmarked. */
  snippet: string;
}

/** Libraries are expected to throw for targets they don't support. */
export function assertJsonSchemaTarget<Supported extends string>(
  target: string | undefined,
  supported: ReadonlyArray<Supported>,
): asserts target is Supported {
  if (!supported.includes(target as never)) {
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
  jsonSchema?: {
    conversion?: {
      toJson?: SchemaConversionToJsonConfig;
      fromJson?: SchemaConversionFromJsonConfig;
    };
    compliance?: {
      validation?: MaybeArray<ComplianceBenchmarkConfig>;
      semantics?: MaybeArray<ComplianceBenchmarkConfig>;
      roundtrip?: MaybeArray<RoundtripComplianceBenchmarkConfig>;
    };
  };
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
