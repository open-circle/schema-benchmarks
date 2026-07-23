import type { Page } from "@playwright/test";
import { optimizeTypeSchema } from "@schema-benchmarks/schemas";

import { expect } from "#e2e/fixtures";
import type { RuntimePage } from "#e2e/fixtures/pages/_runtime";
import { matchBreakpoints } from "#e2e/utils";
import { optimizeTypeProps } from "#src/routes/_benchmarks/_runtime/-constants";

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
        await expect(optimizeTypeCell).toHaveText(optimizeTypeProps.labels[optimizeType].label);
      }
    } else {
      const cards = runtimePage.mobile.cards;
      await expect(cards).not.toHaveCount(0);
      for (const card of await cards.all()) {
        const chipsList = card.getByTestId("bench-card-chips");

        const chips = chipsList.getByRole("listitem");

        await expect(
          chips.filter({ hasText: optimizeTypeProps.labels[optimizeType].label }),
        ).toHaveCount(1);
      }
    }
  }
}

export * as desktop from "./desktop";
export * as mobile from "./mobile";
