import { anyAbortSignal } from "@schema-benchmarks/utils";
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { parseAnsiSequences } from "ansi-sequence-parser";
import Prism from "prismjs";
import loadLanguages from "prismjs/components/";
import * as v from "valibot";

const highlightInput = v.object({
  code: v.string(),
  language: v.optional(v.string(), "typescript"),
  lineNumbers: v.optional(v.boolean()),
});

export const highlightCode = (
  // passing Prism as an argument so it's not bundled on the client
  Prism: typeof import("prismjs"),
  { code, language = "typescript", lineNumbers }: v.InferInput<typeof highlightInput>,
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
  const formatted = Prism.highlight(code, Prism.languages[language]!, language);
  return lineNumbers ? formatted + lineNumbersWrapper : formatted;
};

const NEW_LINE_EXP = /\n(?!$)/g;

export const highlightFn = createServerFn({ method: "POST" })
  .inputValidator(highlightInput)
  .handler(({ data, data: { language } }) => {
    if (!Prism.languages[language]) loadLanguages(language);
    return highlightCode(Prism, data);
  });

export const getHighlightedCode = (
  { code, lineNumbers, language = "typescript" }: v.InferInput<typeof highlightInput>,
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

function escapeForHtml(value: string) {
  return value.replace("<", "&lt;").replace(">", "&gt;");
}

export const highlightAnsi = (
  parseAnsi: (typeof import("ansi-sequence-parser"))["parseAnsiSequences"],
  { input, lineNumbers }: { input: string; lineNumbers?: boolean },
): string => {
  const tokens = parseAnsi(input);
  let lineNumbersWrapper = "";
  if (lineNumbers) {
    const match = input.match(NEW_LINE_EXP);
    const linesNum = match ? match.length + 1 : 1;
    const lines = new Array(linesNum + 1).join("<span></span>");
    lineNumbersWrapper = `<span aria-hidden="true" class="line-numbers-rows">${lines}</span>`;
  }
  return (
    tokens
      .map((token) => {
        // happy path, nothing to do
        if (!token.background && !token.foreground && !token.decorations.size)
          return escapeForHtml(token.value);
        let style = [];
        let classNames = [];
        if (token.background) {
          switch (token.background.type) {
            case "named":
              classNames.push(`bg-${token.background.name}`);
              break;
            case "rgb":
              style.push(`background-color: rgb(${token.background.rgb.join(", ")})`);
              break;
          }
        }
        if (token.foreground) {
          switch (token.foreground.type) {
            case "named":
              classNames.push(`fg-${token.foreground.name}`);
              break;
            case "rgb":
              style.push(`color: rgb(${token.foreground.rgb.join(", ")})`);
              break;
          }
        }
        if (token.decorations.size) classNames.push(...token.decorations);
        const className = classNames.length ? ` class="${classNames.join(" ")}"` : "";
        const styleAttr = style.length ? ` style="${style.join("; ")}"` : "";
        return `<span${className}${styleAttr}>${escapeForHtml(token.value)}</span>`;
      })
      .join("") + lineNumbersWrapper
  );
};

export const highlightAnsiFn = createServerFn({ method: "POST" })
  .inputValidator(v.object({ input: v.string(), lineNumbers: v.optional(v.boolean()) }))
  .handler(({ data }) => highlightAnsi(parseAnsiSequences, data));

export const getHighlightedAnsi = (
  { input, lineNumbers }: { input: string; lineNumbers?: boolean },
  signalOpt?: AbortSignal,
) =>
  queryOptions({
    queryKey: ["highlight", "ansi", input, lineNumbers],
    queryFn: ({ signal }) =>
      highlightAnsiFn({
        data: { input, lineNumbers },
        signal: anyAbortSignal(signal, signalOpt),
      }),
  });
