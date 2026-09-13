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
  getData: (result: NoInfer<ParseResult>) => ProductData | undefined;
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

/**
 * How a library takes an existing type: `builder` is an API the type is passed to; `annotation` is
 * the library's schema type on the declaration, which reports whatever assignability reports.
 */
export const fromTypeStyleSchema = /* @__PURE__ */ v.picklist(["builder", "annotation"]);
export type FromTypeStyle = v.InferOutput<typeof fromTypeStyleSchema>;

/**
 * The ways a schema can disagree with the type it is built for. Each one is compiled against a
 * schema for `{ id: number; name: string; price: number }`, and a library only catches the mistake
 * if the compiler rejects it.
 */
export const fromTypeCaseSchema = /* @__PURE__ */ v.picklist([
  "wrongType",
  "missingField",
  "optionalField",
  "extraField",
]);
export type FromTypeCase = v.InferOutput<typeof fromTypeCaseSchema>;

/**
 * How a library's types are read, for the TypeScript inference benchmarks.
 *
 * The probe is written into the library's own folder, so `imports` can reach the schema module
 * relatively, and the schema it declares is called `probeSchema` - the type expressions below are
 * written in terms of it.
 *
 * @example
 * {
 *   imports: `import * as z from "zod";\nimport { getZodSchema } from "./index.ts";`,
 *   schema: "getZodSchema()",
 *   input: "z.input<typeof probeSchema>",
 *   output: "z.output<typeof probeSchema>",
 * }
 */
export interface TypeInferenceBenchmarkConfig {
  /** Everything the probe needs in scope, including the module the schema comes from. */
  imports: string;
  /** Expression producing the schema, assigned to `probeSchema`. */
  schema: string;
  /** Type expression for the type the schema accepts. Leave out along with `output`. */
  input?: string;
  /** Type expression for the type the schema produces. Leave out along with `input`. */
  output?: string;
  /** Why the library infers nothing from a schema. Give it instead of `input` and `output`. */
  noInference?: string;
  note?: string;
  /**
   * How a schema is built from a type that already exists, with the construction type checked -
   * the reverse of inferring a type from a schema. Both entries are statements, and both are
   * compiled: `valid` has to type check, and `invalid` has to fail, which is what shows the
   * construction is checked rather than merely annotated.
   *
   * Leave it out when the library has no way to do it.
   */
  fromType?: {
    style: FromTypeStyle;
    /**
     * Declares a schema for the type `Product`, which the probe defines. It is compiled once
     * against the type the schema describes, and once against each way a schema can disagree
     * with it.
     */
    schema: string;
    /** The schema is generated from the type, so the two cannot disagree. */
    derived?: boolean;
    note?: string;
  };
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
  types?: TypeInferenceBenchmarkConfig;
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
