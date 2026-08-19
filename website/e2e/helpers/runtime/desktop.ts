import { errorTypeSchema, optimizeTypeSchema } from "@schema-benchmarks/schemas";
import { everyAsync } from "mix-n-matchers/utilities";

import { test, expect } from "#e2e/fixtures";
import type {
  RuntimePage,
  MixinInstanceType,
  withErrorTypeFilter,
} from "#e2e/fixtures/pages/_runtime";
import { ioTs } from "#e2e/utils/libraries";

export async function expectTableDisplay(runtimePage: RuntimePage, library = ioTs) {
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

      const expectedLabel = new RegExp(`^${runtimePage.getOptimizeTypeLabel(optimizeType)}$`, "i");
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

      const expectedLabel = new RegExp(`^${runtimePage.getErrorTypeLabel(errorType)}$`, "i");
      await expect(async () => {
        await everyAsync(runtimePage.desktop.tableHandle, async ({ row }) => {
          await expect(row.getCell("error type")).toHaveText(expectedLabel);
        });
      }).toPass();
    });
  }
}
