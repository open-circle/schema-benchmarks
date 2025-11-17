import * as v from "valibot";

export const libraryTypeSchema = v.picklist(["runtime", "precompiled"]);
export type LibraryType = v.InferOutput<typeof libraryTypeSchema>;

export const dataTypeSchema = v.picklist(["valid", "invalid"]);
export type DataType = v.InferOutput<typeof dataTypeSchema>;

export const errorTypeSchema = v.picklist(["allErrors", "abortEarly"]);
export type ErrorType = v.InferOutput<typeof errorTypeSchema>;

export const benchResultSchema = v.object({
  id: v.string(),
  libraryName: v.string(),
  note: v.optional(v.string()),
  snippet: v.string(),
  mean: v.number(),
});
export type BenchResult = v.InferOutput<typeof benchResultSchema>;

export const benchResultsSchema = v.object({
  initialization: v.object(
    v.entriesFromList(libraryTypeSchema.options, v.array(benchResultSchema)),
  ),
  parsing: v.object(
    v.entriesFromList(
      libraryTypeSchema.options,
      v.object(
        v.entriesFromList(
          dataTypeSchema.options,
          v.object(
            v.entriesFromList(
              errorTypeSchema.options,
              v.array(benchResultSchema),
            ),
          ),
        ),
      ),
    ),
  ),
  validation: v.object(
    v.entriesFromList(
      libraryTypeSchema.options,
      v.object(
        v.entriesFromList(dataTypeSchema.options, v.array(benchResultSchema)),
      ),
    ),
  ),
});
export type BenchResults = v.InferOutput<typeof benchResultsSchema>;

export const minifyTypeSchema = v.picklist(["minified", "unminified"]);
export type MinifyType = v.InferOutput<typeof minifyTypeSchema>;

export const downloadResultSchema = v.object({
  fileName: v.string(),
  libraryName: v.string(),
  note: v.optional(v.string()),
  bytes: v.number(),
});
export type DownloadResult = v.InferOutput<typeof downloadResultSchema>;

export const downloadResultsSchema = v.object({
  minified: v.array(downloadResultSchema),
  unminified: v.array(downloadResultSchema),
});
export type DownloadResults = v.InferOutput<typeof downloadResultsSchema>;
