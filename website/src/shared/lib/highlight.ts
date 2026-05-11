import { anyAbortSignal } from "@schema-benchmarks/utils";
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import Prism from "prismjs";
import loadLanguages from "prismjs/components/index";
import * as v from "valibot";

import { highlightAnsi, highlightCode } from "#/shared/lib/highlight.server";

export const highlightInput = v.object({
  code: v.string(),
  language: v.optional(v.string(), "typescript"),
  lineNumbers: v.optional(v.boolean(), false),
});

export type HighlightInput = v.InferInput<typeof highlightInput>;

export const getHighlightedCodeFn = createServerFn({ method: "POST" })
  .inputValidator(highlightInput)
  .handler(({ data, data: { language } }) => {
    if (!Prism.languages[language]) loadLanguages(language);
    return highlightCode(data);
  });

export const getHighlightedCode = (data: HighlightInput, signalOpt?: AbortSignal) => {
  const { code, language, lineNumbers } = v.parse(highlightInput, data);
  return queryOptions({
    queryKey: ["highlight-code", language, code, lineNumbers],
    structuralSharing: false,
    queryFn: ({ signal }) =>
      getHighlightedCodeFn({
        data: { code, language, lineNumbers },
        signal: anyAbortSignal(signal, signalOpt),
      }),
  });
};

const highlightAnsiInput = v.object({
  input: v.string(),
  lineNumbers: v.optional(v.boolean(), false),
});

export type HighlightAnsiInput = v.InferInput<typeof highlightAnsiInput>;

export const getHighlightedAnsiFn = createServerFn({ method: "POST" })
  .inputValidator(highlightAnsiInput)
  .handler(({ data }) => highlightAnsi(data));

export const getHighlightedAnsi = (data: HighlightAnsiInput, signalOpt?: AbortSignal) => {
  const { input, lineNumbers } = v.parse(highlightAnsiInput, data);
  return queryOptions({
    queryKey: ["highlight-ansi", input, lineNumbers],
    queryFn: ({ signal }) =>
      getHighlightedAnsiFn({
        data: { input, lineNumbers },
        signal: anyAbortSignal(signal, signalOpt),
      }),
  });
};
