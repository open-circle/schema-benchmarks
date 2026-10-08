import { parseAnsiSequences } from "ansi-sequence-parser";
import Prism from "prismjs";
import loadLanguages from "prismjs/components/index";
import { describe, expect, it } from "vite-plus/test";

import { highlightAnsi, highlightCode } from "./highlight";

loadLanguages("jsdoc");

describe("highlightCode", () => {
  it("adds one line-number span for each source line", () => {
    const result = highlightCode(Prism, {
      code: "const answer = 42;\nreturn answer;",
      language: "javascript",
      lineNumbers: true,
    });

    expect(result.match(/<span><\/span>/g)).toHaveLength(2);
    expect(result).toContain('class="line-numbers-rows"');
  });

  it("uses Prism's JSDoc token for documentation comments", () => {
    const first = highlightCode(Prism, { code: "/** docs */", language: "javascript" });
    const second = highlightCode(Prism, { code: "/** more docs */", language: "javascript" });

    expect(first).toContain('class="token doc-comment comment"');
    expect(second).toContain('class="token doc-comment comment"');
  });

  it("highlights JSDoc tags in TypeScript comments", () => {
    const result = highlightCode(Prism, {
      code: "/**\n * @param {string} config The config to merge.\n * @returns {number} The result.\n */",
      language: "typescript",
    });

    expect(result).toContain('<span class="token keyword">@param</span>');
    expect(result).toContain('<span class="token keyword">@returns</span>');
  });

  it("wraps the setup block between markers in a dedicated class", () => {
    const result = highlightCode(Prism, {
      code: [
        "const schema = {};",
        "// setup-start",
        "const validate = compile(schema);",
        "// example usage",
        "// setup-end",
        "validate(data);",
      ].join("\n"),
      language: "javascript",
    });

    expect(result).toContain('<span class="setup-code"><span');
    expect(result).not.toContain("setup-start");
    expect(result).not.toContain("setup-end");
    expect(result).not.toContain('<span class="setup-code">\n');
  });

  it("computes line numbers based on code with setup marker lines removed", () => {
    const result = highlightCode(Prism, {
      code: [
        "const schema = {};",
        "// setup-start",
        "const validate = compile(schema);",
        "// example usage",
        "// setup-end",
        "validate(data);",
      ].join("\n"),
      language: "javascript",
      lineNumbers: true,
    });

    expect(result.match(/<span><\/span>/g)).toHaveLength(4);
  });
});

describe("highlightAnsi", () => {
  it("escapes HTML in unstyled tokens", () => {
    const result = highlightAnsi(parseAnsiSequences, { input: '<script>alert("x")</script>' });

    expect(result).toBe("&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;");
  });

  it("adds line numbers to ANSI output", () => {
    const result = highlightAnsi(parseAnsiSequences, { input: "first\nsecond", lineNumbers: true });

    expect(result.match(/<span><\/span>/g)).toHaveLength(2);
  });
});
