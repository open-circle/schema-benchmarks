import { errorTypeSchema, optimizeTypeSchema } from "@schema-benchmarks/schemas";
import { everyAsync } from "mix-n-matchers/utilities";

import { expect } from "#e2e/fixtures";
import type { RuntimePage, MixinInstanceType, withErrorTypeFilter } from "#e2e/fixtures/runtime.ts";
import { libraryVersions } from "#e2e/utils/library-versions.gen";

// covers every runtime benchmark type, so it works as the shared default across all pages
const defaultLibrary = { name: "sury", version: libraryVersions.sury };

export async function expectTableDisplay(
  runtimePage: RuntimePage,
  library: { name: string; version: string } = defaultLibrary,
) {
  await expect(runtimePage.desktop.table).toBeVisible();

  const libraryRow = runtimePage.desktop.tableHandle.getRow({ library: library.name });

  await expect(libraryRow.getCell("version")).toHaveText(library.version);
}

export async function expectOptimizeFilter(runtimePage: RuntimePage) {
  for (const optimizeType of optimizeTypeSchema.options) {
    await runtimePage.selectOptimizeType(optimizeType);

    const expectedLabel = new RegExp(
      `^${RegExp.escape(runtimePage.getOptimizeTypeLabel(optimizeType))}$`,
      "i",
    );
    await expect(async () => {
      await everyAsync(runtimePage.desktop.tableHandle, async ({ row }) => {
        await expect(row.getCell("optimizations")).toHaveText(expectedLabel);
      });
    }).toPass({ timeout: 15_000 });
  }
}

export async function expectErrorTypeFilter(
  runtimePage: MixinInstanceType<typeof withErrorTypeFilter>,
) {
  for (const errorType of errorTypeSchema.options) {
    await runtimePage.selectErrorType(errorType);

    const expectedLabel = new RegExp(
      `^${RegExp.escape(runtimePage.getErrorTypeLabel(errorType))}$`,
      "i",
    );
    await expect(async () => {
      await everyAsync(runtimePage.desktop.tableHandle, async ({ row }) => {
        await expect(row.getCell("error type")).toHaveText(expectedLabel);
      });
    }).toPass({ timeout: 15_000 });
  }
}
