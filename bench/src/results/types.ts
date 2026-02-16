import { errorTypeSchema, optimizeTypeSchema } from "@schema-benchmarks/schemas";
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

export const initializationResultSchema = v.object({
  ...baseBenchResultSchema.entries,
  type: v.literal("initialization"),
  optimizeType: optimizeTypeSchema,
});
export type InitializationResult = v.InferOutput<typeof initializationResultSchema>;

export const validationResultSchema = v.object({
  ...baseBenchResultSchema.entries,
  type: v.literal("validation"),
  optimizeType: optimizeTypeSchema,
});
export type ValidationResult = v.InferOutput<typeof validationResultSchema>;

export const parsingResultSchema = v.object({
  ...baseBenchResultSchema.entries,
  type: v.literal("parsing"),
  optimizeType: optimizeTypeSchema,
  errorType: errorTypeSchema,
});
export type ParsingResult = v.InferOutput<typeof parsingResultSchema>;

export type BenchResult = InitializationResult | ValidationResult | ParsingResult;

export const benchResultsSchema = v.object({
  initialization: v.array(initializationResultSchema),
  parsing: v.object(v.entriesFromList(dataTypeSchema.options, v.array(parsingResultSchema))),
  validation: v.object(v.entriesFromList(dataTypeSchema.options, v.array(validationResultSchema))),
});
export type BenchResults = v.InferOutput<typeof benchResultsSchema>;

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
