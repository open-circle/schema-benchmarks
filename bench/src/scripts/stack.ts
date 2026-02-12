import * as fs from "node:fs/promises";
import * as path from "node:path";
import { pathToFileURL } from "node:url";
import { assertNotReached, errorData } from "@schema-benchmarks/schemas";
import { libraries } from "@schema-benchmarks/schemas/libraries";
import type { SerializedError, StackResult } from "../results/types.ts";

const scriptUrl = pathToFileURL(import.meta.filename).href;

const benchmarkRegex = new RegExp(
  `\\s*at throw \\(file:\\/\\/\\/.*\\/schemas\\/dist.*\\n\\s*at ${RegExp.escape(scriptUrl)}.*`,
);

function serializeError(e: Error, customStack?: string): SerializedError {
  return {
    message: e.message,
    name: e.name,
    stack: customStack ?? "",
    // cause?
  };
}

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
  const {
    library: { name: libraryName, version },
    createContext,
    stack,
  } = await getConfig();
  if (stack) {
    const { snippet } = stack;
    try {
      const context = await createContext();
      await stack.throw(context, errorData);
      assertNotReached();
    } catch (e) {
      if (Error.isError(e)) {
        if (e.name === "ShouldHaveThrownError") {
          results.push({
            libraryName,
            version,
            snippet,
            line: "no throw",
          });
          continue;
        }
        const hasFrames = e.stack?.includes("    at ");
        if (!hasFrames) {
          results.push({
            libraryName,
            version,
            snippet,
            line: "no stack",
            error: serializeError(e),
          });
          continue;
        }
        const frames = e.stack
          ?.slice(e.stack.indexOf("    at "))
          .replace(/\(.*\/schema-benchmarks\/(?:\/schema-benchmarks\/)?/g, "(");
        const withoutSelf = frames?.replace(benchmarkRegex, "");
        if (withoutSelf) {
          results.push({
            libraryName,
            version,
            snippet,
            line: getScriptLineNumber(frames),
            frameCount: withoutSelf.split("\n").length,
            error: serializeError(e, withoutSelf),
          });
        } else {
          results.push({
            libraryName,
            version,
            snippet,
            line: "no external stack",
            error: serializeError(e),
          });
        }
      } else {
        results.push({
          libraryName,
          version,
          snippet,
          line: "not an error",
        });
      }
    }
  }
  global.gc?.();
}

await fs.writeFile(
  path.join(process.cwd(), "stack.json"),
  JSON.stringify(results),
);
