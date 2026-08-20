import { errorTypeSchema, optimizeTypeSchema } from "@schema-benchmarks/schemas";
import { everyAsync } from "mix-n-matchers/utilities";

import { test, expect } from "#e2e/fixtures";
import type {
  RuntimePage,
  MixinInstanceType,
  withErrorTypeFilter,
} from "#e2e/fixtures/pages/_runtime";
import { libraryVersions } from "#e2e/utils/library-versions.gen";

// covers every runtime benchmark type, so it works as the shared default across all pages
const defaultLibrary = { name: "sury", version: libraryVersions.sury };

export async function expectTableDisplay(
  runtimePage: RuntimePage,
  library: { name: string; version: string } = defaultLibrary,
) {
  await test.step(`Verify ${library.name} is shown in the desktop table`, async () => {
    await expect(runtimePage.desktop.table).toBeVisible();

    const libraryRow = runtimePage.desktop.tableHandle.getRow({ library: library.name });

    await expect(libraryRow.getCell("version")).toHaveText(library.version);
  });
}

export async function expectOptimizeFilter(runtimePage: RuntimePage) {
  for (const optimizeType of optimizeTypeSchema.options) {
    await test.step(`Filter desktop rows by ${runtimePage.getOptimizeTypeLabel(optimizeType)} optimization`, async () => {
      await runtimePage.selectOptimizeType(optimizeType);

      const expectedLabel = new RegExp(
        `^${RegExp.escape(runtimePage.getOptimizeTypeLabel(optimizeType))}$`,
        "i",
      );
      await expect(async () => {
        await everyAsync(runtimePage.desktop.tableHandle, async ({ row }) => {
          await expect(row.getCell("optimizations")).toHaveText(expectedLabel);
        });
      }).toPass();
    });
  }
}

export async function expectErrorTypeFilter(
  runtimePage: MixinInstanceType<typeof withErrorTypeFilter>,
) {
  for (const errorType of errorTypeSchema.options) {
    await test.step(`Filter desktop rows by ${runtimePage.getErrorTypeLabel(errorType)} errors`, async () => {
      await runtimePage.selectErrorType(errorType);

      const expectedLabel = new RegExp(
        `^${RegExp.escape(runtimePage.getErrorTypeLabel(errorType))}$`,
        "i",
      );
      await expect(async () => {
        await everyAsync(runtimePage.desktop.tableHandle, async ({ row }) => {
          await expect(row.getCell("error type")).toHaveText(expectedLabel);
        });
      }).toPass();
    });
  }
}
