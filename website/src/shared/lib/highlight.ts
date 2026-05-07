import { anyAbortSignal } from "@schema-benchmarks/utils";
import { queryOptions } from "@tanstack/react-query";
import { createServerFn, createServerOnlyFn } from "@tanstack/react-start";
import { parseAnsiSequences } from "ansi-sequence-parser";
import _Prism from "prismjs";
import loadLanguages from "prismjs/components/index";
import * as v from "valibot";

const highlightInput = v.object({
  code: v.string(),
  language: v.optional(v.string(), "typescript"),
  lineNumbers: v.optional(v.boolean()),
});

export const highlightCode = createServerOnlyFn(
  (
    Prism: typeof _Prism,
    { code, language = "typescript", lineNumbers }: v.InferInput<typeof highlightInput>,
  ) => {
    if (!Prism.languages[language]) loadLanguages(language);
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
  },
);

export const getHighlightedCodeFn = createServerFn({ method: "POST" })
  .inputValidator(highlightInput)
  .handler(({ data }) => highlightCode(_Prism, data));

export const getHighlightedCode = (
  { code, language, lineNumbers }: v.InferInput<typeof highlightInput>,
  signalOpt?: AbortSignal,
) =>
  queryOptions({
    queryKey: ["highlight-code", language, code, lineNumbers],
    structuralSharing: false,
    queryFn: ({ signal }) =>
      getHighlightedCodeFn({
        data: { code, language, lineNumbers },
        signal: anyAbortSignal(signal, signalOpt),
      }),
  });

const NEW_LINE_EXP = /\n(?!$)/g;

function escapeForHtml(value: string) {
  return value.replace("<", "&lt;").replace(">", "&gt;");
}

export const highlightAnsi = createServerOnlyFn(
  (
    parseSequences: typeof parseAnsiSequences,
    { input, lineNumbers }: { input: string; lineNumbers?: boolean },
  ): string => {
    const tokens = parseSequences(input);
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
  },
);

const highlightAnsiInput = v.object({
  input: v.string(),
  lineNumbers: v.optional(v.boolean()),
});

export const getHighlightedAnsiFn = createServerFn({ method: "POST" })
  .inputValidator(highlightAnsiInput)
  .handler(({ data }) => highlightAnsi(parseAnsiSequences, data));

export const getHighlightedAnsi = (
  { input, lineNumbers }: v.InferInput<typeof highlightAnsiInput>,
  signalOpt?: AbortSignal,
) =>
  queryOptions({
    queryKey: ["highlight-ansi", input, lineNumbers],
    queryFn: ({ signal }) =>
      getHighlightedAnsiFn({
        data: { input, lineNumbers },
        signal: anyAbortSignal(signal, signalOpt),
      }),
  });
