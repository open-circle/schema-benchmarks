import { minifyTypeSchema } from "@schema-benchmarks/bench";

import { test, expect } from "#e2e/fixtures";

test.beforeEach("Go to download page", async ({ page }) => {
  await page.goto("/download");
  await expect(page).toHaveTitle(/Download/);
});

test("it can switch between minified and unminified results", async ({ page, downloadPage }) => {
  for (const minifyType of minifyTypeSchema.options) {
    await downloadPage.selectMinifyType(minifyType);

    await expect(page).toHaveURL((url) => url.searchParams.get("minifyType") === minifyType);
  }
});

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

// no releases for 2 years, so this shouldn't need changing often
const superstructVersion = "2.0.2";

test.describe("desktop view", () => {
  test.beforeEach("Check desktop view", async ({ matchBreakpoints, downloadPage }) => {
    const isDesktop = await matchBreakpoints(downloadPage.breakpoints.desktop);
    test.skip(!isDesktop, "This test is only for desktop viewports");
  });

  test("it displays results table", async ({ downloadPage }) => {
    await expect(downloadPage.desktop.table).toBeVisible();

    const superstructRow = downloadPage.desktop.table
      .getByRole("row")
      .filter({ hasText: /superstruct/i });
    const superstructVersionCell = await downloadPage.desktop.getCellByColumnName(
      superstructRow,
      "Version",
    );

    await expect(superstructVersionCell).toHaveText(superstructVersion);
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

    const superstructVersionEl = superstructCard.getByText(
      new RegExp(RegExp.escape(superstructVersion)),
    );
    await expect(superstructVersionEl).toBeVisible();
  });
});
