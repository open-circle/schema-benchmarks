import { minifyTypeSchema } from "@schema-benchmarks/bench";

import { createTest, expect } from "#e2e/fixtures";
import { DownloadPage } from "#e2e/fixtures/pages/download.ts";
import * as helpers from "#e2e/helpers";
import { libraryVersions } from "#e2e/utils/library-versions.gen.ts";

const test = createTest({ downloadPage: DownloadPage });

test.beforeEach("Go to download page", async ({ fontsLoaded, downloadPage }) => {
  await downloadPage.goto();

  await fontsLoaded();
});

test(
  "it can switch between minified and unminified results",
  { tag: "@smoke" },
  async ({ page, downloadPage }) => {
    for (const minifyType of minifyTypeSchema.options) {
      await test.step(`Select ${minifyType} results`, async () => {
        const link = downloadPage.getMinifyTypeLink(minifyType);

        await link.click();

        await expect(page).toHaveURL((url) => url.searchParams.get("minifyType") === minifyType);

        await expect(link).toBeCurrent("page");
      });
    }
  },
);

test("it can use speed presets", async ({ page, downloadPage }) => {
  await test.step("Select 3G preset", async () => {
    const threeGButton = downloadPage.getSpeedPresetButtonByLabel("3G");
    await threeGButton.click();

    await expect(page).toHaveURL((url) => url.searchParams.get("mbps") === "3g");
    await expect(downloadPage.downloadSpeedInput).toHaveValue("6");
    await expect(threeGButton).toBeCurrent("page");
  });

  await test.step("Select 4G preset", async () => {
    const fourGButton = downloadPage.getSpeedPresetButtonByLabel("4G");
    await fourGButton.click();

    await expect(page).toHaveURL((url) => url.searchParams.get("mbps") === "4g");
    await expect(downloadPage.downloadSpeedInput).toHaveValue("32");
    await expect(fourGButton).toBeCurrent("page");
  });

  await test.step("Select WiFi preset", async () => {
    const wifiButton = downloadPage.getSpeedPresetButtonByLabel("WiFi");
    await wifiButton.click();

    await expect(page).toHaveURL((url) => url.searchParams.get("mbps") === "wifi");
    await expect(downloadPage.downloadSpeedInput).toHaveValue("240");
    await expect(wifiButton).toBeCurrent("page");
  });
});

test("it can set a custom download speed", async ({ page, downloadPage }) => {
  const wifiButton = downloadPage.getSpeedPresetButtonByLabel("WiFi");

  await test.step("Start from the WiFi preset", async () => {
    await wifiButton.click();

    await expect(page).toHaveURL((url) => url.searchParams.get("mbps") === "wifi");
    await expect(downloadPage.downloadSpeedInput).toHaveValue("240");
    await expect(wifiButton).toBeCurrent("page");
  });

  await test.step("Enter a custom speed", async () => {
    await downloadPage.downloadSpeedInput.fill("241");

    await expect(downloadPage.downloadSpeedInput).toHaveValue("241");
    await expect(page).toHaveURL((url) => url.searchParams.get("mbps") === "241");
    // custom value should not keep the preset as current
    await expect(wifiButton).not.toBeCurrent("page");
  });
});

test.describe("desktop view", { tag: "@desktop" }, () => {
  test.beforeEach(async ({ downloadPage }) => {
    await downloadPage.desktop.tableHandle.init();
  });

  test("it displays results table", async ({ downloadPage }) => {
    await expect(downloadPage.desktop.table).toBeVisible();

    const libraryRow = downloadPage.desktop.tableHandle.getRow({ library: "io-ts" });

    await expect(libraryRow.getCell("version")).toHaveText(libraryVersions["io-ts"]);
  });

  test("table can be sorted by column", async ({ downloadPage }) => {
    await helpers.desktop.expectTableSorting(downloadPage.desktop.tableHandle, {
      first: /@paseri/i,
      last: /zod/i,
    });
  });
});

test.describe("mobile view", { tag: "@mobile" }, () => {
  test("it displays results cards", async ({ downloadPage }) => {
    await expect(downloadPage.mobile.cardList).toBeVisible();

    const libraryCard = downloadPage.mobile.getCardByName("io-ts");
    await libraryCard.scrollIntoViewIfNeeded();

    const libraryVersionEl = libraryCard.getByText(libraryVersions["io-ts"]);
    await expect(libraryVersionEl).toBeVisible();
  });
});
