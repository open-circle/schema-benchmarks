import type { Page } from "@playwright/test";
import { dataTypeSchema } from "@schema-benchmarks/bench";
import { errorTypeSchema, optimizeTypeSchema } from "@schema-benchmarks/schemas";

import { expect } from "#e2e/fixtures";
import type {
  RuntimePage,
  MixinInstanceType,
  withDataToggle,
  withErrorTypeFilter,
} from "#e2e/fixtures/pages/_runtime";
import { matchBreakpoints } from "#e2e/utils";

export * as desktop from "./desktop";
export * as mobile from "./mobile";

export async function testOptimizeFilter(page: Page, runtimePage: RuntimePage) {
  const isDesktop = await matchBreakpoints(page, runtimePage.breakpoints.desktop);
  for (const optimizeType of optimizeTypeSchema.options) {
    const optimizeTypeLink = runtimePage.getOptimizeTypeLink(optimizeType);

    await optimizeTypeLink.click();

    await expect(page).toHaveURL((url) => url.searchParams.get("optimizeType") === optimizeType);

    await expect(optimizeTypeLink).toBeCurrent("page");

    if (isDesktop) {
      const rows = await runtimePage.desktop.table.locator("tbody").getByRole("row").all();
      for (const row of rows) {
        const optimizeTypeCell = await runtimePage.desktop.getCellByColumnName(
          row,
          "Optimizations",
        );
        await expect(optimizeTypeCell).toHaveText(runtimePage.getOptimizeTypeLabel(optimizeType));
      }
    } else {
      const cards = await runtimePage.mobile.cards.all();
      for (const card of cards) {
        const chipsList = card.getByTestId("bench-card-chips");

        const chips = chipsList.getByRole("listitem");

        await expect(
          chips.filter({ hasText: runtimePage.getOptimizeTypeLabel(optimizeType) }),
        ).toHaveCount(1);
      }
    }
  }
}

export async function testDataTypeToggle(
  page: Page,
  runtimePage: MixinInstanceType<typeof withDataToggle>,
) {
  for (const dataType of dataTypeSchema.options) {
    const dataTypeLink = runtimePage.getDataTypeLink(dataType);

    await dataTypeLink.click();

    await expect(page).toHaveURL((url) => url.searchParams.get("dataType") === dataType);

    await expect(dataTypeLink).toBeCurrent("page");
  }
}

export async function testErrorTypeFilter(
  page: Page,
  runtimePage: MixinInstanceType<typeof withErrorTypeFilter>,
) {
  const isDesktop = await matchBreakpoints(page, runtimePage.breakpoints.desktop);
  for (const errorType of errorTypeSchema.options) {
    const errorTypeLink = runtimePage.getErrorTypeLink(errorType);

    await errorTypeLink.click();

    await expect(page).toHaveURL((url) => url.searchParams.get("errorType") === errorType);

    await expect(errorTypeLink).toBeCurrent("page");

    if (isDesktop) {
      const rows = await runtimePage.desktop.table.locator("tbody").getByRole("row").all();
      for (const row of rows) {
        const errorTypeCell = await runtimePage.desktop.getCellByColumnName(row, "Error type");
        await expect(errorTypeCell).toHaveText(runtimePage.getErrorTypeLabel(errorType));
      }
    } else {
      const cards = await runtimePage.mobile.cards.all();
      for (const card of cards) {
        const chipsList = card.getByTestId("bench-card-chips");

        const chips = chipsList.getByRole("listitem");

        await expect(
          chips.filter({ hasText: runtimePage.getErrorTypeLabel(errorType) }),
        ).toHaveCount(1);
      }
    }
  }
}
