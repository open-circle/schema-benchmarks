import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as process from "node:process";
import * as url from "node:url";

import { assertNotReached, errorData } from "@schema-benchmarks/schemas";
import { libraries } from "@schema-benchmarks/schemas/libraries";

import type { SerializedError, StackResult } from "../results/types.ts";

// this is probably quite fragile, worth keeping an eye on when we update node

const libDist = import.meta
  .resolve("@schema-benchmarks/schemas/libraries")
  .replace("/index.js", "");

const search = `    at Object.throw (${libDist}/`;

const cwdRegex = new RegExp(
  RegExp.escape(
    url.pathToFileURL(path.resolve(process.cwd(), "..")).href.replace(/^file:\/\//, ""),
  ),
  "g",
);

function serializeError(e: Error, customStack?: string): SerializedError {
  return {
    message: e.message,
    name: e.name,
    stack: customStack,
    // cause?
  };
}

const results: Array<StackResult> = [];

function getScriptLineNumber(stack?: string) {
  if (!stack) return "no stack";
  const lines = stack.split("\n");
  let i = 0;
  while (i < lines.length) {
    if (lines[i]?.startsWith(search)) return i + 1;
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
        const frames = e.stack?.slice(e.stack.indexOf("    at "));
        const line = getScriptLineNumber(frames);
        if (frames && typeof line === "number" && line !== 1) {
          results.push({
            libraryName,
            version,
            snippet,
            line,
            error: serializeError(e, frames.replace(cwdRegex, "")),
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
  JSON.stringify(
    results.toSorted((a, b) => {
      if (typeof a.line === "number" && typeof b.line === "number") {
        return a.line - b.line;
      }
      if (typeof a.line === "number") return -1;
      if (typeof b.line === "number") return 1;
      return 0;
    }),
  ),
);
