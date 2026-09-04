import type { Element, ElementContent, Properties, Root } from "hast";
import { SKIP, visit } from "unist-util-visit";

import type { ResponsiveFormattedCodeGroup } from "#src/shared/lib/oxfmt";
import { formatResponsiveCode } from "#src/shared/lib/oxfmt";

// matches a standalone `responsive` word in the code fence meta string, e.g. ```ts responsive fileName="foo.ts"
const RESPONSIVE_FLAG_EXP = /(?:^|\s)responsive(?=\s|$)/;
const FILE_NAME_EXP = /(?:^|\s)fileName=("([^"]*)"|'([^']*)')(?=\s|$)/;

function getClassName(properties: Properties | undefined): Array<string> {
  const className = properties?.className;
  if (Array.isArray(className)) return className.map(String);
  return typeof className === "string" ? [className] : [];
}

function getLanguage(codeNode: Element): string | undefined {
  return getClassName(codeNode.properties)
    .find((name) => name.startsWith("language-"))
    ?.slice("language-".length);
}

function parseMeta(meta: string): { fileName: string | undefined; remainingMeta: string } {
  const fileNameMatch = meta.match(FILE_NAME_EXP);
  const fileName = fileNameMatch?.[2] ?? fileNameMatch?.[3];
  const remainingMeta = meta.replace(RESPONSIVE_FLAG_EXP, " ").replace(FILE_NAME_EXP, " ").trim();
  return { fileName, remainingMeta };
}

function buildResponsiveBlock(
  originalPre: Element,
  originalCode: Element,
  remainingMeta: string,
  groups: Array<ResponsiveFormattedCodeGroup>,
): Element {
  return {
    type: "element",
    tagName: "div",
    properties: { className: ["responsive-code-block"] },
    children: groups.map(({ code, widths }): ElementContent => ({
      type: "element",
      tagName: "div",
      properties: {
        className: [
          "responsive-code-block__block",
          ...widths.map((width) => `responsive-code-block__block--${width}`),
        ],
      },
      children: [
        {
          type: "element",
          tagName: "pre",
          properties: { ...originalPre.properties },
          children: [
            {
              type: "element",
              tagName: "code",
              properties: { ...originalCode.properties },
              data: remainingMeta ? { meta: remainingMeta } : undefined,
              children: [{ type: "text", value: `${code}\n` }],
            },
          ],
        },
      ],
    })),
  };
}

/**
 * Rehype plugin that turns fenced code blocks marked with `responsive` in their meta string
 * (e.g. ```ts responsive fileName="schemas.ts") into the same output as `ResponsiveCodeBlock`:
 * the source is formatted with oxfmt at several print widths, and each distinct result is
 * rendered as its own `<pre>` block, shown/hidden via CSS container queries at runtime.
 *
 * Must run before syntax-highlighting rehype plugins, so they highlight each generated block.
 */
export default function rehypeResponsiveCode() {
  return async (tree: Root) => {
    const replacements: Array<() => Promise<void>> = [];

    visit(tree, "element", (node, index, parent) => {
      if (node.tagName !== "pre" || index === undefined || !parent) return;
      const codeNode = node.children.find(
        (child): child is Element => child.type === "element" && child.tagName === "code",
      );
      if (!codeNode) return;

      const meta = typeof codeNode.data?.meta === "string" ? codeNode.data.meta : "";
      if (!RESPONSIVE_FLAG_EXP.test(` ${meta} `)) return;

      const [textNode] = codeNode.children;
      if (textNode?.type !== "text") return;

      const { fileName, remainingMeta } = parseMeta(meta);
      const sourceText = textNode.value;
      const resolvedFileName = fileName ?? `code.${getLanguage(codeNode) ?? "ts"}`;

      replacements.push(async () => {
        const groups = await formatResponsiveCode(resolvedFileName, sourceText);
        parent.children[index] = buildResponsiveBlock(node, codeNode, remainingMeta, groups);
      });

      return SKIP;
    });

    await Promise.all(replacements.map((replace) => replace()));
  };
}
