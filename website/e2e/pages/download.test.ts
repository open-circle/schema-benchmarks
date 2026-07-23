import { minifyTypeSchema } from "@schema-benchmarks/bench";

import { test, expect } from "#e2e/fixtures";
import { library } from "#e2e/utils/constants";

test.beforeEach("Go to download page", async ({ page, fontsLoaded }) => {
  await page.goto("/download");

  await fontsLoaded();

  await expect(page).toHaveTitle(/Download/);
});

test(
  "it can switch between minified and unminified results",
  { tag: "@smoke" },
  async ({ page, downloadPage }) => {
    for (const minifyType of minifyTypeSchema.options) {
      const link = downloadPage.getMinifyTypeLink(minifyType);

      await link.click();

      await expect(page).toHaveURL((url) => url.searchParams.get("minifyType") === minifyType);

      await expect(link).toBeCurrent("page");
    }
  },
);

test("it can use speed presets", async ({ page, downloadPage }) => {
  const threeGButton = downloadPage.getSpeedPresetButtonByLabel("3G");
  await threeGButton.click();

  await expect(page).toHaveURL((url) => url.searchParams.get("mbps") === "3g");
  await expect(downloadPage.downloadSpeedInput).toHaveValue("6");
  await expect(threeGButton).toBeCurrent("page");

  const fourGButton = downloadPage.getSpeedPresetButtonByLabel("4G");
  await fourGButton.click();

  await expect(page).toHaveURL((url) => url.searchParams.get("mbps") === "4g");
  await expect(downloadPage.downloadSpeedInput).toHaveValue("32");
  await expect(fourGButton).toBeCurrent("page");

  const wifiButton = downloadPage.getSpeedPresetButtonByLabel("WiFi");
  await wifiButton.click();

  await expect(page).toHaveURL((url) => url.searchParams.get("mbps") === "wifi");
  await expect(downloadPage.downloadSpeedInput).toHaveValue("240");
  await expect(wifiButton).toBeCurrent("page");
});

test("it can set a custom download speed", async ({ page, downloadPage }) => {
  await downloadPage.downloadSpeedInput.fill("240");

  await expect(page).toHaveURL((url) => url.searchParams.get("mbps") === "240");
  await expect(downloadPage.downloadSpeedInput).toHaveValue("240");
  // same value, but preset wasn't used, so it shouldn't be current
  await expect(downloadPage.getSpeedPresetButtonByLabel("WiFi")).not.toBeCurrent("page");
});

test.describe("desktop view", () => {
  test.beforeEach("Check desktop view", async ({ matchBreakpoints, downloadPage }) => {
    const isDesktop = await matchBreakpoints(downloadPage.breakpoints.desktop);
    test.skip(!isDesktop, "This test is only for desktop viewports");
  });

  test("it displays results table", async ({ downloadPage }) => {
    await expect(downloadPage.desktop.table).toBeVisible();

    const superstructRow = downloadPage.desktop.table
      .getByRole("row")
      .filter({ hasText: library.name });
    const superstructVersionCell = await downloadPage.desktop.getCellByColumnName(
      superstructRow,
      "Version",
    );

    await expect(superstructVersionCell).toHaveText(library.version);
  });

  test("table can be sorted by column", async ({ downloadPage }) => {
    const libraryHeaderCell = downloadPage.desktop.getHeaderCell("Library");
    const librarySortLink = libraryHeaderCell.getByRole("link");

    await librarySortLink.click();

    await expect(libraryHeaderCell).toHaveAttribute("aria-sort", "ascending");

    const firstRow = downloadPage.desktop.table.getByRole("row").nth(1);
    const firstRowLibraryCell = await downloadPage.desktop.getCellByColumnName(firstRow, "Library");

    await expect(firstRowLibraryCell).toHaveText(/@paseri/i);

    await librarySortLink.click();

    await expect(libraryHeaderCell).toHaveAttribute("aria-sort", "descending");

    await expect(firstRowLibraryCell).toHaveText(/zod/i);
  });
});

test.describe("mobile view", () => {
  test.beforeEach("Check mobile view", async ({ matchBreakpoints, downloadPage }) => {
    const isDesktop = await matchBreakpoints(downloadPage.breakpoints.desktop);
    test.skip(isDesktop, "This test is only for mobile viewports");
  });

  test("it displays results cards", async ({ downloadPage }) => {
    await expect(downloadPage.mobile.cardList).toBeVisible();

    const superstructCard = downloadPage.mobile.getCardByName(/superstruct/i);
    await superstructCard.scrollIntoViewIfNeeded();

    const superstructVersionEl = superstructCard.getByText(library.version);
    await expect(superstructVersionEl).toBeVisible();
  });
});
