import * as fs from "node:fs/promises";
import * as path from "node:path";
import { pathToFileURL } from "node:url";
import { assertNotReached, errorData } from "@schema-benchmarks/schemas";
import { libraries } from "@schema-benchmarks/schemas/libraries";

const scriptUrl = pathToFileURL(import.meta.filename).href;

const benchmarkRegex = new RegExp(
  `\\s*at throw \\(file:\\/\\/\\/.*\\/schemas\\/dist.*\\n\\s*at ${RegExp.escape(scriptUrl)}.*`,
);

interface BaseStackResult {
  libraryName: string;
}

interface SuccessfulStackResult extends BaseStackResult {
  line: number;
  frameCount: number;
  error: Error;
}

function serializeError(e: Error, customStack?: string): Error {
  return {
    message: e.message,
    name: e.name,
    stack: customStack ?? "",
    // cause?
  };
}

type ErrorTypes = {
  "no throw": unknown;
  "not an error": unknown;
  "no stack": {
    error: Error;
  };
  "no external stack": {
    error: Error;
  };
  "not found": unknown;
};

type UnsuccessfulStackResult = BaseStackResult &
  {
    [K in keyof ErrorTypes]: {
      line: K;
    } & ErrorTypes[K];
  }[keyof ErrorTypes];

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
        const hasFrames = e.stack?.includes("    at ");
        if (!hasFrames) {
          results.push({
            libraryName: library.name,
            line: "no stack",
            error: serializeError(e),
          });
          continue;
        }
        const frames = e.stack?.slice(e.stack.indexOf("    at "));
        const withoutSelf = frames?.replace(benchmarkRegex, "");
        if (withoutSelf) {
          results.push({
            libraryName: library.name,
            line: getScriptLineNumber(frames),
            frameCount: withoutSelf.split("\n").length,
            error: serializeError(e, withoutSelf),
          });
        } else {
          results.push({
            libraryName: library.name,
            line: "no external stack",
            error: serializeError(e),
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

await fs.writeFile(
  path.join(process.cwd(), "stack.json"),
  JSON.stringify(results, null, 2),
);
