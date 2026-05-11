import { parseAnsiSequences } from "ansi-sequence-parser";
import Prism from "prismjs";

import type { HighlightAnsiInput, HighlightInput } from "#/shared/lib/highlight";

const NEW_LINE_EXP = /\n(?!$)/g;

let hookAdded = false;
export const highlightCode = ({ code, language = "typescript", lineNumbers }: HighlightInput) => {
  let lineNumbersWrapper = "";
  if (lineNumbers) {
    const match = code.match(NEW_LINE_EXP);
    const linesNum = match ? match.length + 1 : 1;
    const lines = new Array(linesNum + 1).join("<span></span>");

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

function escapeForHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export const highlightAnsi = ({ input, lineNumbers }: HighlightAnsiInput): string => {
  const tokens = parseAnsiSequences(input);
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
