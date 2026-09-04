import * as url from "node:url";

import { getOrInsertComputed } from "@schema-benchmarks/utils";
import type { format } from "oxfmt";

// oxlint-disable-next-line typescript/consistent-type-imports
type OxfmtMod = typeof import("oxfmt");

let oxfmtPromise: Promise<OxfmtMod> | null = null;

export async function getOxfmt(): Promise<OxfmtMod> {
  if (!oxfmtPromise) {
    const bindingCandidate = `@oxfmt/binding-linux-${process.arch}-gnu`;

    // Make oxfmt load the exact native binary path instead of relying on optional dependency package metadata.
    try {
      process.env.NAPI_RS_NATIVE_LIBRARY_PATH = url.fileURLToPath(
        import.meta.resolve(bindingCandidate),
      );
    } catch {
      // Ignore if the native library path cannot be resolved.
      console.log(
        `Warning: Failed to resolve native library path for ${bindingCandidate}. Falling back to default oxfmt behavior.`,
      );
    }

    oxfmtPromise = import("oxfmt");
  }

  return oxfmtPromise;
}

export const aggregateFormatErrors = (errors: Awaited<ReturnType<typeof format>>["errors"]) =>
  new Error("Failed to format code", { cause: errors });

export const printWidths = [40, 60, 80, 100] as const;
export type PrintWidth = (typeof printWidths)[number];

export interface ResponsiveFormattedCodeGroup {
  widths: Array<PrintWidth>;
  code: string;
}

export async function formatResponsiveCode(
  fileName: string,
  sourceText: string,
): Promise<Array<ResponsiveFormattedCodeGroup>> {
  const { format } = await getOxfmt();
  const formatted = await Promise.all(
    printWidths.map((width) =>
      format(fileName, sourceText, { sortImports: true, printWidth: width }).then((result) => {
        if (result.errors.length) {
          throw aggregateFormatErrors(result.errors);
        }
        return { width, code: result.code };
      }),
    ),
  );
  const groups = new Map<string, ResponsiveFormattedCodeGroup>();
  for (const { width, code } of formatted) {
    getOrInsertComputed(groups, code, () => ({ widths: [], code })).widths.push(width);
  }
  return Array.from(groups.values());
}
