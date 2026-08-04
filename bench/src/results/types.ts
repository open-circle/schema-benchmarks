import {
  complianceResultsSchema,
  complianceTargetSchema,
} from "@schema-benchmarks/json-schema-tests";
import {
  errorTypeSchema,
  jsonSchemaDirectionSchema,
  jsonSchemaConversionTargetSchema,
  optimizeTypeSchema,
  stringFormatSchema,
  complianceTypeSchema,
} from "@schema-benchmarks/schemas";
import type { OneOf } from "@schema-benchmarks/utils";
import { unsafeFromEntries } from "@schema-benchmarks/utils";
import * as v from "valibot";

export const dataTypeSchema = v.picklist(["invalid", "valid"]);
export type DataType = v.InferOutput<typeof dataTypeSchema>;

export const baseBenchResultSchema = v.object({
  id: v.string(),
  libraryName: v.string(),
  version: v.string(),
  note: v.optional(v.string()),
  snippet: v.string(),
  throws: v.optional(v.boolean()),
  mean: v.number(),
});
export type BaseBenchResult = v.InferOutput<typeof baseBenchResultSchema>;

export const runtimeBenchResultSchema = v.object({
  ...baseBenchResultSchema.entries,
  optimizeType: optimizeTypeSchema,
});
export type RuntimeBenchResult = v.InferOutput<typeof runtimeBenchResultSchema>;

export const initializationResultSchema = v.object({
  ...runtimeBenchResultSchema.entries,
  type: v.literal("initialization"),
});
export type InitializationResult = v.InferOutput<typeof initializationResultSchema>;

export const validationResultSchema = v.object({
  ...runtimeBenchResultSchema.entries,
  type: v.literal("validation"),
});
export type ValidationResult = v.InferOutput<typeof validationResultSchema>;

export const parsingResultSchema = v.object({
  ...runtimeBenchResultSchema.entries,
  type: v.literal("parsing"),
  errorType: errorTypeSchema,
});
export type ParsingResult = v.InferOutput<typeof parsingResultSchema>;

const standardResultSchema = v.object({
  ...runtimeBenchResultSchema.entries,
  errorType: errorTypeSchema,
  type: v.literal("standard"),
});
export type StandardResult = v.InferOutput<typeof standardResultSchema>;

const jsonSchemaSourceResultSchema = v.union([
  v.picklist(["native", "opt-in"]),
  v.object({
    type: v.literal("package"),
    package: v.string(),
  }),
]);
export type JsonSchemaSourceResult = v.InferOutput<typeof jsonSchemaSourceResultSchema>;

const schemaConversionToJsonResultSchema = v.object({
  ...v.omit(baseBenchResultSchema, ["throws"]).entries,

  target: jsonSchemaConversionTargetSchema,
  direction: jsonSchemaDirectionSchema,
  /** The JSON schema the library generated, so it can be compared with the others. */
  jsonSchema: v.string(),
});
export type SchemaToJsonResult = v.InferOutput<typeof schemaConversionToJsonResultSchema>;

const schemaConversionFromJsonResultSchema = v.object({
  ...v.omit(baseBenchResultSchema, ["throws"]).entries,
});
export type SchemaFromJsonResult = v.InferOutput<typeof schemaConversionFromJsonResultSchema>;

export type JsonSchemaConversionResult = OneOf<SchemaToJsonResult | SchemaFromJsonResult>;

export const jsonSchemaSupportMatrixSchema = v.object(
  v.entriesFromList(
    jsonSchemaConversionTargetSchema.options,
    v.optional(
      v.object(v.entriesFromList(jsonSchemaDirectionSchema.options, v.optional(v.string()))),
    ),
  ),
);
export type JsonSchemaSupportMatrix = v.InferOutput<typeof jsonSchemaSupportMatrixSchema>;

export const jsonSchemaSupportMatricesSchema = v.record(
  v.string(),
  v.object({
    version: v.string(),
    source: jsonSchemaSourceResultSchema,
    standardJsonSchema: v.optional(jsonSchemaSourceResultSchema),
    matrix: jsonSchemaSupportMatrixSchema,
  }),
);
export type JsonSchemaSupportMatrices = v.InferOutput<typeof jsonSchemaSupportMatricesSchema>;

const jsonComplianceResultSchema = v.object({
  ...v.omit(baseBenchResultSchema, ["throws", "mean"]).entries,
  source: jsonSchemaSourceResultSchema,
  results: complianceResultsSchema,
});
export type JsonComplianceResult = v.InferOutput<typeof jsonComplianceResultSchema>;

export const jsonSchemaBenchResultsSchema = v.object({
  conversion: v.object({
    toJson: v.array(schemaConversionToJsonResultSchema),
    fromJson: v.array(schemaConversionFromJsonResultSchema),
    toJsonSupport: jsonSchemaSupportMatricesSchema,
  }),
  compliance: v.record(
    complianceTypeSchema,
    v.object(
      v.entriesFromList(complianceTargetSchema.options, v.array(jsonComplianceResultSchema)),
    ),
  ),
});
export type JsonSchemaBenchResults = v.InferOutput<typeof jsonSchemaBenchResultsSchema>;
export const getEmptyJsonComplianceResults = () =>
  unsafeFromEntries(complianceTargetSchema.options.map((target) => [target, []]));
export const getEmptyJsonSchemaResults = (): JsonSchemaBenchResults => ({
  conversion: {
    toJson: [],
    fromJson: [],
    toJsonSupport: {},
  },
  compliance: {
    validation: getEmptyJsonComplianceResults(),
    semantics: getEmptyJsonComplianceResults(),
    roundtrip: getEmptyJsonComplianceResults(),
  },
});

const stringResultSchema = v.object({
  ...runtimeBenchResultSchema.entries,
  type: v.literal("string"),
});
export type StringResult = v.InferOutput<typeof stringResultSchema>;

export const codecResultSchema = v.object({
  ...v.omit(runtimeBenchResultSchema, ["snippet", "mean"]).entries,
  encode: v.object({
    snippet: v.string(),
    mean: v.number(),
  }),
  decode: v.object({
    snippet: v.string(),
    mean: v.number(),
  }),
  type: v.literal("codec"),
  acceptsUnknown: v.optional(v.boolean()),
});

export type CodecResult = v.InferOutput<typeof codecResultSchema>;

export type RuntimeResult = OneOf<
  InitializationResult | ValidationResult | ParsingResult | StandardResult | StringResult
>;

export const benchResultsSchema = v.object({
  initialization: v.array(initializationResultSchema),
  parsing: v.object(v.entriesFromList(dataTypeSchema.options, v.array(parsingResultSchema))),
  validation: v.object(v.entriesFromList(dataTypeSchema.options, v.array(validationResultSchema))),
  standard: v.object(v.entriesFromList(dataTypeSchema.options, v.array(standardResultSchema))),
  string: v.object(
    v.entriesFromList(
      stringFormatSchema.options,
      v.object(v.entriesFromList(dataTypeSchema.options, v.array(stringResultSchema))),
    ),
  ),
  codec: v.array(codecResultSchema),
});
export type BenchResults = v.InferOutput<typeof benchResultsSchema>;
export const getEmptyResults = (): BenchResults => ({
  initialization: [],
  parsing: { valid: [], invalid: [] },
  validation: { valid: [], invalid: [] },
  standard: { valid: [], invalid: [] },
  string: unsafeFromEntries(
    stringFormatSchema.options.map((format) => [format, { valid: [], invalid: [] }]),
  ),
  codec: [],
});

export const minifyTypeSchema = v.picklist(["minified", "unminified"]);
export type MinifyType = v.InferOutput<typeof minifyTypeSchema>;

export const downloadResultSchema = v.object({
  fileName: v.string(),
  libraryName: v.string(),
  version: v.string(),
  note: v.optional(v.string()),
  bytes: v.number(),
  gzipBytes: v.number(),
});
export type DownloadResult = v.InferOutput<typeof downloadResultSchema>;

export const downloadResultsSchema = v.object({
  minified: v.array(downloadResultSchema),
  unminified: v.array(downloadResultSchema),
});
export type DownloadResults = v.InferOutput<typeof downloadResultsSchema>;

const resultTypeSchema = v.picklist(["success", "not an error", "no stack", "not found"]);

export const stackResultSchema = v.object({
  type: resultTypeSchema,
  libraryName: v.string(),
  version: v.string(),
  snippet: v.string(),
  frame: v.optional(v.number()),
  output: v.string(),
  lineCount: v.number(),
});
export type StackResult = v.InferOutput<typeof stackResultSchema>;
