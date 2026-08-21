import { createTest } from "#e2e/fixtures";
import { StandardSchemaPage } from "#e2e/fixtures/pages/standard.ts";
import * as helpers from "#e2e/helpers";

const test = createTest({ standardSchemaPage: StandardSchemaPage });

test.beforeEach(async ({ fontsLoaded, standardSchemaPage }) => {
  await standardSchemaPage.goto();

  await fontsLoaded();
});

test("can toggle between valid and invalid results", async ({ page, standardSchemaPage }) => {
  await helpers.runtime.expectDataTypeToggle(page, standardSchemaPage);
});

test.describe("optimization filter", () => {
  test.describe("desktop", { tag: "@desktop" }, () => {
    test("can be filtered by optimization type", async ({ standardSchemaPage }) => {
      await helpers.runtime.desktop.expectOptimizeFilter(standardSchemaPage);
    });
  });

  test.describe("mobile", { tag: "@mobile" }, () => {
    test("can be filtered by optimization type", async ({ standardSchemaPage }) => {
      await helpers.runtime.mobile.expectOptimizeFilter(standardSchemaPage);
    });
  });
});

test.describe("error type filter", () => {
  test.describe("desktop", { tag: "@desktop" }, () => {
    test("can be filtered by error type", async ({ standardSchemaPage }) => {
      await helpers.runtime.desktop.expectErrorTypeFilter(standardSchemaPage);
    });
  });

  test.describe("mobile", { tag: "@mobile" }, () => {
    test("can be filtered by error type", async ({ standardSchemaPage }) => {
      await helpers.runtime.mobile.expectErrorTypeFilter(standardSchemaPage);
    });
  });
});

test.describe("desktop view", { tag: "@desktop" }, () => {
  test.beforeEach(async ({ standardSchemaPage }) => {
    await standardSchemaPage.desktop.tableHandle.init();
  });

  test("it displays results table", async ({ standardSchemaPage }) => {
    await helpers.runtime.desktop.expectTableDisplay(standardSchemaPage);
  });

  test("table can be sorted by column", async ({ standardSchemaPage }) => {
    await helpers.desktop.expectTableSorting(standardSchemaPage.desktop.tableHandle, {
      first: /@paseri/i,
      last: /zod/i,
    });
  });
});

test.describe("mobile view", { tag: "@mobile" }, () => {
  test("it displays results cards", async ({ standardSchemaPage }) => {
    await helpers.runtime.mobile.expectCardDisplay(standardSchemaPage);
  });
});
