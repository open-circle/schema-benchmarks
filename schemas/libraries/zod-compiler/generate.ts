import { execFileSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

const srcFile = path.resolve(import.meta.dirname, "./index.ts");

const compiledFile = path.resolve(import.meta.dirname, "./compiled.gen.ts");
const compiledBag = path.resolve(import.meta.dirname, "./compiled-bag.gen.ts");
const compiledCompact = path.resolve(import.meta.dirname, "./compiled-compact.gen.ts");

const indexGenFile = path.resolve(import.meta.dirname, "./index.gen.ts");
const bagGenFile = path.resolve(import.meta.dirname, "./bag.gen.ts");
const compactGenFile = path.resolve(import.meta.dirname, "./compact.gen.ts");

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
execFileSync("pnpm", [
  "exec",
  "zod-compiler",
  "generate",
  srcFile,
  "--output",
  compiledCompact,
  "--emit",
  "compact",
]);

// post-processing needed:
// compiled.gen.ts: add `// @ts-nocheck` and annotate type of variable as `typeof compiledProductSchema`

function addTypeAnnotation(filePath: string) {
  const content = fs.readFileSync(filePath, "utf-8");

  const importAlias = content.match(/import { compiledProductSchema as (\w+) } from .*/)?.[1];

  if (!importAlias) {
    throw new Error("Could not find import alias for compiledProductSchema");
  }

  const fixedContent = content.replace(
    "export const compiledProductSchema =",
    `export const compiledProductSchema: typeof ${importAlias} =`,
  );

  fs.writeFileSync(filePath, `// @ts-nocheck\n${fixedContent}`, "utf-8");
}

addTypeAnnotation(compiledFile);
addTypeAnnotation(compiledCompact);

// compiled-bag.gen.ts: add `// @ts-nocheck` and annotate type of variable as `CompiledSchema<ProductData>` (add imports for `CompiledSchema` and `ProductData`)

const bagContent = fs.readFileSync(compiledBag, "utf-8");

const bagFixedContent = bagContent.replace(
  "export const compiledProductSchema =",
  `export const compiledProductSchema: CompiledSchema<ProductData> =`,
);

fs.writeFileSync(
  compiledBag,
  `// @ts-nocheck\nimport { CompiledSchema } from "zod-compiler";\nimport type { ProductData } from "#src";\n${bagFixedContent}`,
  "utf-8",
);

function factoryify(sourcePath: string, outputPath: string, fnName = "getZodCompilerSchema") {
  const content = fs.readFileSync(sourcePath, "utf-8");

  const importStatements = content.match(/import .* from .*/g) || [];

  const type = content.match(/export const compiledProductSchema: (.*) = \//)?.[1];

  if (!type) {
    throw new Error("Could not find type for compiledProductSchema");
  }

  const factoryContent = `
// @ts-nocheck
${importStatements.join("\n")}

export function ${fnName}(): ${type} {
${content
  .replace(/import .* from .*/g, "")
  .replace(`export const compiledProductSchema: ${type} =`, "return")
  .trim()}
}
`;

  fs.writeFileSync(outputPath, factoryContent, "utf-8");
}

// index.gen.ts: add `// @ts-nocheck` and wrap all the generated code in a function so we can measure initialization time

factoryify(compiledFile, indexGenFile);

// bag.gen.ts: add `// @ts-nocheck` and wrap all the generated code in a function so we can measure initialization time

factoryify(compiledBag, bagGenFile, "getZodCompilerBagSchema");
factoryify(compiledCompact, compactGenFile, "getZodCompilerCompactSchema");
