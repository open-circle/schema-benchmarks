import { optimizeTypeSchema } from "@schema-benchmarks/schemas";

import { test, expect } from "#e2e/fixtures";
import { substringToRegex } from "#e2e/utils";
import { optimizeTypeProps } from "#src/routes/_benchmarks/_runtime/-constants";

test.beforeEach(async ({ page, fontsLoaded }) => {
  await page.goto("/initialization");

  await fontsLoaded();

  await expect(page).toHaveTitle(/Initialization/);
});

test("can be filtered by optimization type", async ({
  page,
  matchBreakpoints,
  initializationPage,
}) => {
  const isDesktop = await matchBreakpoints(initializationPage.breakpoints.desktop);
  for (const optimizeType of optimizeTypeSchema.options) {
    const optimizeTypeLink = initializationPage.getOptimizeTypeLink(optimizeType);

    await optimizeTypeLink.click();

    await expect(page).toHaveURL((url) => url.searchParams.get("optimizeType") === optimizeType);

    await expect(optimizeTypeLink).toBeCurrent("page");

    if (isDesktop) {
      const rows = await initializationPage.desktop.table.locator("tbody").getByRole("row").all();
      for (const row of rows) {
        const optimizeTypeCell = await initializationPage.desktop.getCellByColumnName(
          row,
          "Optimizations",
        );
        await expect(optimizeTypeCell).toHaveText(optimizeTypeProps.labels[optimizeType].label);
      }
    } else {
      const cards = initializationPage.mobile.cards;
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
});

const superstructVersion = "2.0.2";

test.describe("desktop view", () => {
  test.beforeEach("Check desktop view", async ({ matchBreakpoints, initializationPage }) => {
    const isDesktop = await matchBreakpoints(initializationPage.breakpoints.desktop);
    test.skip(!isDesktop, "This test is only for desktop viewports");
  });

  test("it displays results table", async ({ initializationPage }) => {
    await expect(initializationPage.desktop.table).toBeVisible();

    const superstructRow = initializationPage.desktop.table
      .getByRole("row")
      .filter({ hasText: /superstruct/i });
    const superstructVersionCell = await initializationPage.desktop.getCellByColumnName(
      superstructRow,
      "Version",
    );

    await expect(superstructVersionCell).toHaveText(superstructVersion);
  });

  test("table can be sorted by column", async ({ initializationPage }) => {
    const libraryHeaderCell = initializationPage.desktop.getHeaderCell("Library");
    const librarySortLink = libraryHeaderCell.getByRole("link");

    await librarySortLink.click();

    await expect(libraryHeaderCell).toHaveAttribute("aria-sort", "ascending");

    const firstRow = initializationPage.desktop.table.getByRole("row").nth(1);
    const firstRowLibraryCell = await initializationPage.desktop.getCellByColumnName(
      firstRow,
      "Library",
    );

    await expect(firstRowLibraryCell).toHaveText(/@paseri/i);

    await expect(async () => {
      await librarySortLink.click();

      await expect(libraryHeaderCell).toHaveAttribute("aria-sort", "descending");
    }).toPass();

    await expect(firstRowLibraryCell).toHaveText(/zod/i);
  });
});

test.describe("mobile view", () => {
  test.beforeEach("Check mobile view", async ({ matchBreakpoints, initializationPage }) => {
    const isDesktop = await matchBreakpoints(initializationPage.breakpoints.desktop);
    test.skip(isDesktop, "This test is only for mobile viewports");
  });

  test("it displays results cards", async ({ initializationPage }) => {
    await expect(initializationPage.mobile.cardsList).toBeVisible();

    const superstructCard = initializationPage.mobile.getCardByLibraryName(/superstruct/i);
    await superstructCard.scrollIntoViewIfNeeded();

    const superstructVersionEl = superstructCard.getByText(substringToRegex(superstructVersion));
    await expect(superstructVersionEl).toBeVisible();
  });
});
