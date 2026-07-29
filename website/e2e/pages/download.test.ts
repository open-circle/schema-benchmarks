import { minifyTypeSchema } from "@schema-benchmarks/bench";

import { test, expect } from "#e2e/fixtures";
import { ioTs } from "#e2e/utils/libraries.ts";

test.beforeEach(
  "Go to download page",
  async ({ page, fontsLoaded, matchBreakpoints, downloadPage }) => {
    await downloadPage.goto();

    await fontsLoaded();

    await expect(page).toHaveTitle(/Download/);

    const isDesktop = await matchBreakpoints(downloadPage.breakpoints.desktop);
    if (isDesktop) {
      await expect(downloadPage.desktop.table).toBeVisible();
      await downloadPage.desktop.tableHandle.init();
    }
  },
);

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
  const wifiButton = downloadPage.getSpeedPresetButtonByLabel("WiFi");

  await wifiButton.click();

  await expect(page).toHaveURL((url) => url.searchParams.get("mbps") === "wifi");
  await expect(downloadPage.downloadSpeedInput).toHaveValue("240");
  await expect(wifiButton).toBeCurrent("page");

  await downloadPage.downloadSpeedInput.fill("241");

  await expect(downloadPage.downloadSpeedInput).toHaveValue("241");
  await expect(page).toHaveURL((url) => url.searchParams.get("mbps") === "241");
  // custom value should not keep the preset as current
  await expect(wifiButton).not.toBeCurrent("page");
});

test.describe("desktop view", () => {
  test.beforeEach("Check desktop view", async ({ matchBreakpoints, downloadPage }) => {
    const isDesktop = await matchBreakpoints(downloadPage.breakpoints.desktop);
    test.skip(!isDesktop, "This test is only for desktop viewports");
  });

  test("it displays results table", async ({ downloadPage }) => {
    await expect(downloadPage.desktop.table).toBeVisible();

    const libraryRow = downloadPage.desktop.tableHandle.getRow({ library: ioTs.name });

    await expect(libraryRow.getCell("version")).toHaveText(ioTs.version);
  });

  test("table can be sorted by column", async ({ downloadPage }) => {
    await downloadPage.desktop.tableHandle.init();

    const libraryHeaderCell = await downloadPage.desktop.tableHandle.getHeaderCell("library");
    const librarySortLink = libraryHeaderCell.getByRole("link");

    await librarySortLink.click();

    await expect(libraryHeaderCell).toHaveAttribute("aria-sort", "ascending");

    const firstRow = downloadPage.desktop.tableHandle.getRowByIndex(0);
    const firstRowLibraryCell = firstRow.getCell("library");

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

    const libraryCard = downloadPage.mobile.getCardByName(ioTs.name);
    await libraryCard.scrollIntoViewIfNeeded();

    const libraryVersionEl = libraryCard.getByText(ioTs.version);
    await expect(libraryVersionEl).toBeVisible();
  });
});
