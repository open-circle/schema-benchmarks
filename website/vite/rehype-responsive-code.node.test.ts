import { compile } from "@mdx-js/mdx";
import rehypeCodeProps from "rehype-mdx-code-props";
import { describe, expect, it } from "vitest";

import rehypeResponsiveCode from "./rehype-responsive-code.ts";

async function compileMdx(source: string) {
  const result = await compile(source, {
    rehypePlugins: [rehypeResponsiveCode, rehypeCodeProps],
  });
  return String(result);
}

describe("rehypeResponsiveCode", () => {
  it("splits a `responsive` code fence into one block per distinct formatted width", async () => {
    const output = await compileMdx(`
\`\`\`ts responsive fileName="schemas.ts"
export const userSchema = {name:"string",age:"number",email:"string",isActive:"boolean"};
\`\`\`
`);

    expect(output).toContain('"responsive-code-block"');
    expect(output).toContain("responsive-code-block__block--40");
    expect(output).toContain("responsive-code-block__block--100");
    // every one of the 4 configured print widths must be represented across the generated blocks
    const widths = [...output.matchAll(/responsive-code-block__block--(\d+)/g)].map((m) => m[1]);
    expect(new Set(widths)).toEqual(new Set(["40", "60", "80", "100"]));
  });

  it("leaves non-responsive code fences untouched", async () => {
    const output = await compileMdx(`
\`\`\`ts
const x=1;
\`\`\`
`);

    expect(output).not.toContain("responsive-code-block");
  });

  it("passes through other meta props (e.g. title) to each generated block", async () => {
    const output = await compileMdx(`
\`\`\`ts responsive fileName="schemas.ts" title="schemas.ts"
export const userSchema = {name:"string",age:"number",email:"string",isActive:"boolean"};
\`\`\`
`);

    expect(output.match(/title: "schemas\.ts"/g)?.length).toBeGreaterThan(1);
  });
});
