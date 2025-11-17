import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import Prism from "prismjs";
import loadLanguages from "prismjs/components/";
import * as v from "valibot";

export const highlightFn = createServerFn()
  .inputValidator(
    v.union([
      v.object({ code: v.string(), language: v.optional(v.string()) }),
      v.pipe(
        v.string(),
        v.transform((code) => ({ code, language: undefined })),
      ),
    ]),
  )
  .handler(({ data: { code, language = "typescript" } }) => {
    if (!Prism.languages[language]) loadLanguages([language]);
    // biome-ignore lint/style/noNonNullAssertion: we've loaded it above
    return Prism.highlight(code, Prism.languages[language]!, language);
  });

export const getHighlightedCode = ({
  code,
  language = "typescript",
}: {
  code: string;
  language?: string;
}) =>
  queryOptions({
    queryKey: ["highlight", language, code],
    queryFn: () => highlightFn({ data: { code, language } }),
  });
