import * as url from "node:url";

import { anyAbortSignal } from "@schema-benchmarks/utils";
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { parseAnsiSequences } from "ansi-sequence-parser";
import Prism from "prismjs";
import loadLanguages from "prismjs/components/index";
import * as v from "valibot";

export const highlightInput = v.object({
  code: v.string(),
  language: v.optional(v.string(), "typescript"),
  lineNumbers: v.optional(v.boolean(), false),
});

export type HighlightInput = v.InferInput<typeof highlightInput>;

const NEW_LINE_EXP = /\n(?!$)/g;

let hookAdded = false;
export const highlightCode = (
  // oxlint-disable-next-line typescript/consistent-type-imports
  Prism: typeof import("prismjs"),
  { code, language = "typescript", lineNumbers }: HighlightInput,
) => {
  let lineNumbersWrapper = "";
  if (lineNumbers) {
    const match = code.match(NEW_LINE_EXP);
    const linesNum = match ? match.length + 1 : 1;
    const lines = Array.from({ length: linesNum + 1 }, () => "<span></span>").join("");

    lineNumbersWrapper = `<span aria-hidden="true" class="line-numbers-rows">${lines}</span>`;
  }
  if (!hookAdded) {
    Prism.hooks.add("wrap", (env) => {
      if (env.type === "comment" && env.content.startsWith("/**")) {
        env.classes.push("doc-comment");
      }
    });
    hookAdded = true;
  }
  const formatted = Prism.highlight(code, Prism.languages[language]!, language);
  return formatted + lineNumbersWrapper;
};

export const getHighlightedCodeFn = createServerFn({ method: "POST" })
  .validator(highlightInput)
  .handler(({ data, data: { language } }) => {
    if (!Prism.languages[language]) loadLanguages(language);
    return highlightCode(Prism, data);
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

function escapeForHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export const highlightAnsi = (
  // oxlint-disable-next-line typescript/consistent-type-imports
  parseAnsiSequences: (typeof import("ansi-sequence-parser"))["parseAnsiSequences"],
  { input, lineNumbers }: HighlightAnsiInput,
): string => {
  const tokens = parseAnsiSequences(input);
  let lineNumbersWrapper = "";
  if (lineNumbers) {
    const match = input.match(NEW_LINE_EXP);
    const linesNum = match ? match.length + 1 : 1;
    const lines = Array.from({ length: linesNum + 1 }, () => "<span></span>").join("");
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

export const getHighlightedAnsiFn = createServerFn({ method: "POST" })
  .validator(highlightAnsiInput)
  .handler(({ data }) => highlightAnsi(parseAnsiSequences, data));

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

export const getFormattedCodeFn = createServerFn({ method: "POST" })
  .validator(v.object({ fileName: v.string(), sourceText: v.string() }))
  .handler(async ({ data: { fileName, sourceText } }) => {
    const { format } = await getOxfmt();
    const result = await format(fileName, sourceText, { sortImports: true });
    if (result.errors.length) {
      throw new Error(
        `Failed to format code:\n\n${result.errors.map((e) => "- " + e.message).join("\n")}`,
      );
    }
    return result.code;
  });

// oxlint-disable-next-line typescript/consistent-type-imports
type OxfmtMod = typeof import("oxfmt");

let oxfmtPromise: Promise<OxfmtMod> | null = null;

async function getOxfmt(): Promise<OxfmtMod> {
  if (!oxfmtPromise) {
    const bindingCandidate = `@oxfmt/binding-linux-${process.arch}-gnu`;

    // Make oxfmt load the exact native binary path instead of relying on optional dependency package metadata.
    try {
      process.env.NAPI_RS_NATIVE_LIBRARY_PATH = url.fileURLToPath(
        import.meta.resolve(bindingCandidate),
      );
    } catch {
      // Ignore if the native library path cannot be resolved.
      console.log(
        `Warning: Failed to resolve native library path for ${bindingCandidate}. Falling back to default oxfmt behavior.`,
      );
    }

    oxfmtPromise = import("oxfmt");
  }

  return oxfmtPromise;
}

export const getFormattedCode = (
  { fileName, sourceText }: { fileName: string; sourceText: string },
  signalOpt?: AbortSignal,
) => {
  return queryOptions({
    queryKey: ["format-code", fileName, sourceText],
    queryFn: ({ signal }) =>
      getFormattedCodeFn({
        data: { fileName, sourceText },
        signal: anyAbortSignal(signal, signalOpt),
      }),
  });
};
