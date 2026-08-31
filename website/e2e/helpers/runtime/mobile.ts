import { test } from "@playwright/test";
import { errorTypeSchema, optimizeTypeSchema } from "@schema-benchmarks/schemas";
import { every } from "mix-n-matchers/utilities";

import { expect } from "#e2e/fixtures";
import type { RuntimePage, MixinInstanceType, withErrorTypeFilter } from "#e2e/fixtures/runtime.ts";
import { libraryVersions } from "#e2e/utils/library-versions.gen";

// covers every runtime benchmark type, so it works as the shared default across all pages
const defaultLibrary = { name: "sury", version: libraryVersions.sury };

export async function expectListDisplay(
  runtimePage: RuntimePage,
  library: { name: string; version: string } = defaultLibrary,
) {
  await test.step(`Verify ${library.name} is shown in the mobile results`, async () => {
    const item = runtimePage.mobile.getListItemByLibraryName(library.name).first();
    await item.scrollIntoViewIfNeeded();

    const versionEl = item.getByText(library.version);
    await expect(versionEl).toBeVisible();
  });
}

async function expectFilterItems(runtimePage: RuntimePage, expectedLabel: string) {
  const expectedLabelRegex = new RegExp(RegExp.escape(expectedLabel), "i");

  await expect(async () => {
    await every(await runtimePage.mobile.items.all(), async (item) => {
      const details = item.locator("details");
      const detailsIsOpen = await details.getAttribute("open");
      if (!detailsIsOpen) {
        await details.click();
      }
      await expect(item).toContainText(expectedLabelRegex);
    });
  }).toPass();
}

export async function expectOptimizeFilter(runtimePage: RuntimePage) {
  for (const optimizeType of optimizeTypeSchema.options) {
    await test.step(`Filter mobile list items by ${runtimePage.getOptimizeTypeLabel(optimizeType)} optimization`, async () => {
      await runtimePage.selectOptimizeType(optimizeType);
      await expectFilterItems(runtimePage, runtimePage.getOptimizeTypeLabel(optimizeType));
    });
  }
}

export async function expectErrorTypeFilter(
  runtimePage: MixinInstanceType<typeof withErrorTypeFilter>,
) {
  for (const errorType of errorTypeSchema.options) {
    await test.step(`Filter mobile list items by ${runtimePage.getErrorTypeLabel(errorType)} errors`, async () => {
      await runtimePage.selectErrorType(errorType);
      await expectFilterItems(runtimePage, runtimePage.getErrorTypeLabel(errorType));
    });
  }
}
