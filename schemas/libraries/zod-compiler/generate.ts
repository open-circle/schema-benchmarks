import { execFileSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

const srcFile = path.resolve(import.meta.dirname, "./index.ts");

const outFile = path.resolve(import.meta.dirname, "./index.gen.ts");

execFileSync("pnpm", ["exec", "zod-compiler", "generate", srcFile, "--output", outFile]);

const fileContent = fs.readFileSync(outFile, "utf-8");

// find `import { compiledProductSchema as <foo> }` and save the alias name to a variable
const importRegex = /import\s+\{\s+compiledProductSchema\s+as\s+(\w+)\s+\}/;
const match = fileContent.match(importRegex);
if (!match) {
  throw new Error("Could not find compiledProductSchema import in generated file");
}
const aliasName = match[1];

const updatedFileContent = fileContent.replace(
  `export const compiledProductSchema`,
  `export const compiledProductSchema: typeof ${aliasName}`,
);

// prepend ts-ignore comment to the generated file
const tsIgnoreComment = "// @ts-nocheck\n";
fs.writeFileSync(outFile, tsIgnoreComment + updatedFileContent);
