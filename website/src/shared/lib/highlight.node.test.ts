import { parseAnsiSequences } from "ansi-sequence-parser";
import Prism from "prismjs";
import { describe, expect, it } from "vitest";

import { highlightAnsi, highlightCode } from "./highlight";

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

  it("does not register the documentation comment hook more than once", () => {
    const before = Prism.hooks.all.wrap?.length ?? 0;
    const first = highlightCode(Prism, { code: "/** docs */", language: "javascript" });
    const afterFirst = Prism.hooks.all.wrap?.length ?? 0;
    highlightCode(Prism, { code: "/** more docs */", language: "javascript" });
    const afterSecond = Prism.hooks.all.wrap?.length ?? 0;

    expect(first).toContain("doc-comment");
    expect(afterFirst).toBeLessThanOrEqual(before + 1);
    expect(afterSecond).toBe(afterFirst);
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
