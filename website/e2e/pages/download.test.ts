import { minifyTypeSchema } from "@schema-benchmarks/bench";

import { test, expect } from "#e2e/fixtures";

test.beforeEach(async ({ page, downloadPage }) => {
  await page.goto("/download");
  await expect(page).toHaveTitle(/Download/);

  await expect(downloadPage.resultsTable).toBeVisible();
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
