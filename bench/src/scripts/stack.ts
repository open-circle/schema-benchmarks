import * as child_process from "node:child_process";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as process from "node:process";
import * as url from "node:url";
import { promisify } from "node:util";

import { assertNotReached, errorData } from "@schema-benchmarks/schemas";
import { libraries } from "@schema-benchmarks/schemas/libraries";
import { forwardStd } from "@schema-benchmarks/utils/node";

import type { StackResult } from "../results/types.ts";

const execFile = promisify(child_process.execFile);

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

async function getLoggedOutput(lib: string) {
  const { stderr } = await forwardStd(
    execFile(
      process.execPath,
      [path.resolve(process.cwd(), "./src/scripts/stack/log.ts"), `--lib=${lib}`],
      { env: { ...process.env, FORCE_COLOR: "1" } },
    ),
  );
  const output = stderr.replace(cwdRegex, "");
  const lineCount = output.split("\n").length;
  return { output, lineCount };
}

const results: Array<StackResult> = [];

function getScriptLineNumber(stack?: string) {
  if (!stack) return undefined;
  const lines = stack.split("\n");
  let i = 0;
  while (i < lines.length) {
    if (lines[i]?.startsWith(search)) return i === 0 ? undefined : i + 1;
    i++;
  }
  return undefined;
}

for (const [lib, getConfig] of Object.entries(libraries)) {
  const {
    library: { name: libraryName, version },
    stack,
  } = await getConfig();
  if (stack) {
    const { snippet } = stack;
    try {
      await stack.throw(errorData);
      assertNotReached();
    } catch (e) {
      const output = await getLoggedOutput(lib);
      if (Error.isError(e)) {
        if (e.name === "ShouldHaveThrownError") throw e;
        const hasFrames = e.stack?.includes("    at ");
        if (!hasFrames) {
          results.push({
            type: "no stack",
            libraryName,
            version,
            snippet,
            ...output,
          });
          continue;
        }
        const frames = e.stack?.slice(e.stack.indexOf("    at "));
        const frame = getScriptLineNumber(frames);
        results.push({
          type: "success",
          libraryName,
          version,
          snippet,
          frame,
          ...output,
        });
      } else {
        results.push({
          type: "not an error",
          libraryName,
          version,
          snippet,
          ...output,
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
      if (typeof a.frame === "number" && typeof b.frame === "number") return a.frame - b.frame;
      if (typeof a.frame === "number") return -1;
      if (typeof b.frame === "number") return 1;
      return 0;
    }),
  ),
);
