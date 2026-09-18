import * as fs from "node:fs";
import * as path from "node:path";

import { fromTypeCaseSchema } from "@schema-benchmarks/schemas";
import { libraries } from "@schema-benchmarks/schemas/libraries";
import { describe, expect, it } from "vitest";

import { probeTypes, SCHEMAS_DIR } from "#src/scripts/types/probe.ts";

/**
 * Exercises every library's real `types/index.ts`/`types/fromType.ts`. `pnpm typecheck` already
 * catches a broken import or expression in these files, but not one missing a shape `probeTypes`
 * requires instead of merely inferring - a `schema` export, a `style`, or `Input`/`Output` both
 * present rather than just one.
 */
const librariesWithTypes = Object.keys(libraries)
  .map((libraryPath) => path.dirname(libraryPath))
  .filter((library) =>
    fs.existsSync(path.join(SCHEMAS_DIR, "libraries", library, "types", "index.ts")),
  );

describe.each(librariesWithTypes)("%s", (library) => {
  const directory = path.join(SCHEMAS_DIR, "libraries", library);

  it("matches the shape probeTypes expects", () => {
    const result = probeTypes(directory);

    // a library either has something to probe, or a reason it doesn't - never both, never neither
    expect(Boolean(result.inference)).toBe(!result.noInference);

    if (fs.existsSync(path.join(directory, "types", "fromType.ts"))) {
      expect(result.fromType).toBeDefined();
      expect(Object.keys(result.fromType!.cases).toSorted()).toEqual(
        [...fromTypeCaseSchema.options].toSorted(),
      );
    } else {
      expect(result.fromType).toBeUndefined();
    }
  });
});
