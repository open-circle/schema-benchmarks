import { pathToFileURL } from "node:url";
import { assertNotReached, errorData } from "@schema-benchmarks/schemas";
import { libraries } from "@schema-benchmarks/schemas/libraries";

const scriptUrl = pathToFileURL(import.meta.filename).href;

const benchmarkRegex = new RegExp(
  `\\s*at throw \\(file:\\/\\/\\/.*\\/schemas\\/dist.*\\n\\s*at ${RegExp.escape(scriptUrl)}.*`,
);

interface SuccessfulStackResult {
  libraryName: string;
  line: number;
  frameCount: number;
}

interface UnsuccessfulStackResult {
  libraryName: string;
  line:
    | "no throw"
    | "not an error"
    | "no stack"
    | "no external stack"
    | "not found";
}

type StackResult = SuccessfulStackResult | UnsuccessfulStackResult;

const results: Array<StackResult> = [];

function getScriptLineNumber(stack?: string) {
  if (!stack) return "no stack";
  const lines = stack.split("\n");
  let i = 0;
  while (i < lines.length) {
    if (lines[i]?.includes(scriptUrl)) {
      return lines[i - 1]?.includes("at throw ") ? i - 1 : i;
    }
    i++;
  }
  return "not found";
}

for (const getConfig of Object.values(libraries)) {
  const { library, createContext, throw: throwFn } = await getConfig();
  if (throwFn) {
    try {
      const context = await createContext();
      await throwFn(context, errorData);
      assertNotReached();
    } catch (e) {
      if (Error.isError(e)) {
        if (e.name === "ShouldHaveThrownError") {
          results.push({
            libraryName: library.name,
            line: "no throw",
          });
          continue;
        }
        const cleanedStack = e.stack?.slice(e.stack.indexOf("    at "));
        const withoutSelf = cleanedStack?.replace(benchmarkRegex, "");
        if (withoutSelf) {
          results.push({
            libraryName: library.name,
            line: getScriptLineNumber(cleanedStack),
            frameCount: withoutSelf.split("\n").length,
          });
        } else {
          results.push({
            libraryName: library.name,
            line: "no external stack",
          });
        }
      } else {
        results.push({
          libraryName: library.name,
          line: "not an error",
        });
      }
    }
  }
  global.gc?.();
}

console.table(
  results.sort((a, b) => {
    if (typeof a.line !== "number") return 1;
    if (typeof b.line !== "number") return -1;
    return a.line - b.line;
  }),
);
