import { anyAbortSignal } from "@schema-benchmarks/utils";
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import Prism from "prismjs";
import loadLanguages from "prismjs/components/";
import * as v from "valibot";

export const highlightInput = v.object({
  code: v.string(),
  language: v.optional(v.string(), "typescript"),
  lineNumbers: v.optional(v.boolean()),
});

const NEW_LINE_EXP = /\n(?!$)/g;

export const highlightCode = (
  // we want to be able to call this from the client (storybook) without Prism getting included in our client bundle
  // passing it as a parameter means it gets treeshaken properly
  Prism: typeof import("prismjs"),
  {
    code,
    language = "typescript",
    lineNumbers = false,
  }: v.InferInput<typeof highlightInput>,
) => {
  let lineNumbersWrapper = "";
  Prism.hooks.add("before-tokenize", (env) => {
    const match = env.code.match(NEW_LINE_EXP);
    const linesNum = match ? match.length + 1 : 1;
    const lines = new Array(linesNum + 1).join("<span></span>");

    lineNumbersWrapper = `<span aria-hidden="true" class="line-numbers-rows">${lines}</span>`;
  });
  Prism.hooks.add("wrap", (env) => {
    if (env.type === "comment" && env.content.startsWith("/**")) {
      env.classes.push("doc-comment");
    }
  });
  const formatted = Prism.highlight(
    code,
    // biome-ignore lint/style/noNonNullAssertion: should be loaded - either by serverFn or vite plugin
    Prism.languages[language]!,
    language,
  );
  return lineNumbers ? formatted + lineNumbersWrapper : formatted;
};

export const highlightFn = createServerFn()
  .inputValidator(highlightInput)
  .handler(({ data }) => {
    if (!Prism.languages[data.language]) {
      loadLanguages([data.language]);
    }
    return highlightCode(Prism, data);
  });

export const getHighlightedCode = (
  {
    code,
    lineNumbers,
    language = "typescript",
  }: v.InferInput<typeof highlightInput>,
  signalOpt?: AbortSignal,
) =>
  queryOptions({
    queryKey: ["highlight", language, code, lineNumbers],
    queryFn: ({ signal }) =>
      highlightFn({
        data: { code, language, lineNumbers },
        signal: anyAbortSignal(signal, signalOpt),
      }),
  });
