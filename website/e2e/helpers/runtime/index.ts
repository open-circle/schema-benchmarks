import type { Page } from "@playwright/test";
import { dataTypeSchema } from "@schema-benchmarks/bench";
import { errorTypeSchema, optimizeTypeSchema } from "@schema-benchmarks/schemas";
import { every, everyAsync } from "mix-n-matchers/utilities";

import { test, expect } from "#e2e/fixtures";
import type {
  RuntimePage,
  MixinInstanceType,
  withDataToggle,
  withErrorTypeFilter,
} from "#e2e/fixtures/pages/_runtime";
import { matchBreakpoints } from "#e2e/utils";

export * as desktop from "./desktop";
export * as mobile from "./mobile";

async function expectResultsToMatchFilter(
  page: Page,
  runtimePage: RuntimePage,
  cellName: string,
  expectedLabel: string,
) {
  const isDesktop = await matchBreakpoints(page, runtimePage.breakpoints.desktop);
  if (isDesktop) {
    await test.step(`Verify desktop rows match ${expectedLabel}`, async () => {
      const expectedLabelRegex = new RegExp(`^${expectedLabel}$`, "i");
      await expect(async () => {
        await everyAsync(runtimePage.desktop.tableHandle, async ({ row }) => {
          const cell = row.getCell(cellName);
          await expect(cell).toHaveText(expectedLabelRegex);
        });
      }).toPass();
    });
  } else {
    await test.step(`Verify mobile cards match ${expectedLabel}`, async () => {
      const expectedLabelRegex = new RegExp(expectedLabel, "i");
      await expect(async () => {
        const chips = runtimePage.mobile.cards.getByTestId("bench-card-chips");
        const labels = await chips.allTextContents();

        every(labels, (label) => {
          expect(label).toMatch(expectedLabelRegex);
        });
      }).toPass();
    });
  }
}

export async function expectOptimizeFilter(page: Page, runtimePage: RuntimePage) {
  for (const optimizeType of optimizeTypeSchema.options) {
    await test.step(`Filter by ${runtimePage.getOptimizeTypeLabel(optimizeType)} optimization`, async () => {
      const optimizeTypeLink = runtimePage.getOptimizeTypeLink(optimizeType);
      const optimizeTypeLabel = runtimePage.getOptimizeTypeLabel(optimizeType);

      await optimizeTypeLink.click();

      await expect(page).toHaveURL((url) => url.searchParams.get("optimizeType") === optimizeType);

      await expect(optimizeTypeLink).toBeCurrent("page");

      await expectResultsToMatchFilter(page, runtimePage, "optimizations", optimizeTypeLabel);
    });
  }
}

export async function expectDataTypeToggle(
  page: Page,
  runtimePage: MixinInstanceType<typeof withDataToggle>,
) {
  for (const dataType of dataTypeSchema.options) {
    await test.step(`Select ${dataType} data`, async () => {
      const dataTypeLink = runtimePage.getDataTypeLink(dataType);

      await dataTypeLink.click();

      await expect(page).toHaveURL((url) => url.searchParams.get("dataType") === dataType);

      await expect(dataTypeLink).toBeCurrent("page");
    });
  }
}

export async function expectErrorTypeFilter(
  page: Page,
  runtimePage: MixinInstanceType<typeof withErrorTypeFilter>,
) {
  for (const errorType of errorTypeSchema.options) {
    await test.step(`Filter by ${runtimePage.getErrorTypeLabel(errorType)} errors`, async () => {
      const errorTypeLink = runtimePage.getErrorTypeLink(errorType);
      const errorTypeLabel = runtimePage.getErrorTypeLabel(errorType);

      await errorTypeLink.click();

      await expect(page).toHaveURL((url) => url.searchParams.get("errorType") === errorType);

      await expect(errorTypeLink).toBeCurrent("page");

      await expectResultsToMatchFilter(page, runtimePage, "error type", errorTypeLabel);
    });
  }
}
