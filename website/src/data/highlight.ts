import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import Prism from "prismjs";
import loadLanguages from "prismjs/components/";
import * as v from "valibot";

const highlightInput = v.object({
  code: v.string(),
  language: v.optional(v.string()),
});

export const highlightFn = createServerFn()
  .inputValidator(highlightInput)
  .handler(({ data: { code, language = "typescript" } }) => {
    if (!Prism.languages[language]) loadLanguages([language]);
    // biome-ignore lint/style/noNonNullAssertion: we've loaded it above
    return Prism.highlight(code, Prism.languages[language]!, language);
  });

export const getHighlightedCode = (
  { code, language = "typescript" }: v.InferInput<typeof highlightInput>,
  signalOpt?: AbortSignal,
) =>
  queryOptions({
    queryKey: ["highlight", language, code],
    queryFn: ({ signal }) =>
      highlightFn({
        data: { code, language },
        signal: signalOpt ? AbortSignal.any([signal, signalOpt]) : signal,
      }),
  });
