import * as url from "node:url";

import { getOrInsertComputed, partition } from "@schema-benchmarks/utils";

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
  const formatted = await Promise.allSettled(
    printWidths.map((width) =>
      format(fileName, sourceText, { sortImports: true, printWidth: width }).then((result) => {
        if (result.errors.length) {
          throw result;
        }
        return { width, code: result.code };
      }),
    ),
  );
  const [fulfilled, rejected] = partition(formatted, (result) => result.status === "fulfilled");
  if (rejected.length) {
    console.warn(
      `Warning: Some formatting operations failed for file ${fileName}:\n${(
        rejected[0]!.reason as Awaited<ReturnType<typeof format>>
      ).errors
        .map((e) => `- ${e.message}`)
        .join("\n")}\nSource text:\n${sourceText}`,
    );
  }
  const groups = new Map<string, ResponsiveFormattedCodeGroup>();
  for (const result of fulfilled) {
    const { width, code } = result.value;
    getOrInsertComputed(groups, code, () => ({ widths: [], code })).widths.push(width);
  }
  return Array.from(groups.values());
}
