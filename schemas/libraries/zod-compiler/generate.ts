import { execFileSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

const srcFile = path.resolve(import.meta.dirname, "./index.ts");

const compiledFile = path.resolve(import.meta.dirname, "./compiled.gen.ts");
const compiledBag = path.resolve(import.meta.dirname, "./compiled-bag.gen.ts");

const indexGenFile = path.resolve(import.meta.dirname, "./index.gen.ts");

execFileSync("pnpm", ["exec", "zod-compiler", "generate", srcFile, "--output", compiledFile]);
execFileSync("pnpm", [
  "exec",
  "zod-compiler",
  "generate",
  srcFile,
  "--output",
  compiledBag,
  "--emit",
  "bag",
]);

// post-processing needed:
// compiled.gen.ts: add `// @ts-nocheck` and annotate type of variable as `typeof compiledProductSchema`

const originalContent = fs.readFileSync(compiledFile, "utf-8");

const importAlias = originalContent.match(/import { compiledProductSchema as (\w+) } from .*/)?.[1];

if (!importAlias) {
  throw new Error("Could not find import alias for compiledProductSchema");
}

const fixedContent = originalContent.replace(
  "export const compiledProductSchema =",
  `export const compiledProductSchema: typeof ${importAlias} =`,
);

fs.writeFileSync(compiledFile, `// @ts-nocheck\n${fixedContent}`, "utf-8");

// compiled-bag.gen.ts: add `// @ts-nocheck` and annotate type of variable as `CompiledSchema<output<typeof compiledProductSchema>>` (add imports for `CompiledSchema` and `output`)

const bagContent = fs.readFileSync(compiledBag, "utf-8");

const bagFixedContent = bagContent.replace(
  "export const compiledProductSchema =",
  `export const compiledProductSchema: CompiledSchema<output<typeof ${importAlias}>> =`,
);

fs.writeFileSync(
  compiledBag,
  `// @ts-nocheck\nimport { CompiledSchema } from "zod-compiler";\nimport { output } from "zod";\n${bagFixedContent}`,
  "utf-8",
);

// index.gen.ts: add `// @ts-nocheck` and wrap all the generated code in a function so we can measure initialization time

const getImportRegex = () => /import .* from .*/g;

const importStatements = originalContent.match(getImportRegex()) || [];

// wrap all the generated code in a function so we can measure initialization time
const indexContent = `
// @ts-nocheck
${importStatements.join("\n")}

export function getZodCompilerSchema(): typeof ${importAlias} {
${originalContent.replace(getImportRegex(), "").replace(`export const compiledProductSchema: typeof ${importAlias} =`, "return").trim()}
}
`;

fs.writeFileSync(indexGenFile, indexContent, "utf-8");
