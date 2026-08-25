import { createTest } from "#e2e/fixtures";
import * as helpers from "#e2e/helpers";

import { ValidationPage } from "./index.e2e.model";

const test = createTest({ validationPage: ValidationPage });

test.beforeEach(async ({ fontsLoaded, validationPage }) => {
  await validationPage.goto();

  await fontsLoaded();
});

test("can toggle between valid and invalid results", async ({ page, validationPage }) => {
  await helpers.runtime.expectDataTypeToggle(page, validationPage);
});

test.describe("optimization filter", () => {
  test.describe("desktop", { tag: "@desktop" }, () => {
    test("can be filtered by optimization type", async ({ validationPage }) => {
      await helpers.runtime.desktop.expectOptimizeFilter(validationPage);
    });
  });

  test.describe("mobile", { tag: "@mobile" }, () => {
    test("can be filtered by optimization type", async ({ validationPage }) => {
      await helpers.runtime.mobile.expectOptimizeFilter(validationPage);
    });
  });
});

test.describe("desktop view", { tag: "@desktop" }, () => {
  test.beforeEach(async ({ validationPage }) => {
    await validationPage.desktop.tableHandle.init();
  });

  test("it displays results table", async ({ validationPage }) => {
    await helpers.runtime.desktop.expectTableDisplay(validationPage);
  });

  test("table can be sorted by column", async ({ validationPage }) => {
    await helpers.desktop.expectTableSorting(validationPage.desktop.tableHandle, {
      first: /@railway-ts/i,
      last: /zod/i,
    });
  });
});

test.describe("mobile view", { tag: "@mobile" }, () => {
  test("it displays results list items", async ({ validationPage }) => {
    await helpers.runtime.mobile.expectListDisplay(validationPage);
  });
});
